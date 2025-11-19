"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import { useTheme } from "../contexts/ThemeContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { colors } = useTheme();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }),
    []
  );
  const TAX_RATE = 0.18;
  const SHIPPING_FEE = 49;
  const FREE_SHIPPING_LIMIT = 750;

  // KART ALANI STATE
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");

  const subTotal = useMemo(
    () => cart.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0),
    [cart]
  );
  const taxTotal = useMemo(() => Number((subTotal * TAX_RATE).toFixed(2)), [subTotal]);
  const shippingFee = useMemo(
    () => (subTotal === 0 || subTotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE),
    [subTotal]
  );
  const grandTotal = useMemo(
    () => Number((subTotal + taxTotal + shippingFee).toFixed(2)),
    [subTotal, taxTotal, shippingFee]
  );
  const formatCurrency = (value: number) => currencyFormatter.format(value || 0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawCart = localStorage.getItem('cart');
    if (rawCart) {
      const items = JSON.parse(rawCart);
      setCart(items);
    }
  }, []);

  const [guestEmail, setGuestEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!cardNumber || !expiry || !cvv || !cardName) {
      setMessage("Lütfen kredi kartı bilgilerini doldurun.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Sepetiniz boş");
      return;
    }

    if (!fullName.trim() || !city.trim() || !address.trim()) {
      setMessage("Lütfen teslimat bilgilerini doldurun.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const body: any = {
        items: cart.map((item) => ({ productId: item.id, quantity: item.qty })),
        shippingAddress: { fullName, city, address, phone, notes },
        paymentInfo: {
          cardName,
          cardNumber: '**** **** **** ' + cardNumber.slice(-4),
          expiry,
        },
      };
      if (!token) {
        if (!guestEmail || !guestEmail.includes('@')) {
          setMessage('Giriş yapmadıysanız lütfen e‑posta girin');
          setLoading(false);
          return;
        }
        body.guestEmail = guestEmail;
      }

      await api.post('/orders', body, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      setMessage(isLoggedIn ? 'Sipariş oluşturuldu! Profil sayfanızdan siparişi takip edebilirsiniz.' : 'Sipariş oluşturuldu! Teşekkürler.');
      localStorage.removeItem('cart');

      try {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
      } catch {}

      try {
        window.dispatchEvent(
          new CustomEvent('notify', {
            detail: { type: 'success', message: 'Sipariş başarıyla oluşturuldu!' },
          })
        );
      } catch {}

      setTimeout(() => router.replace(isLoggedIn ? '/profile' : '/'), 800);
    } catch (err) {
      console.error(err);
      setMessage('Sipariş oluşturulamadı');
    }
    setLoading(false);
  };

  return (
    <div className={`py-12 px-6 bg-${colors.bgLight} min-h-screen`}>
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 border-2 border-gray-100">
        <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-10 text-center`}>
          Ödeme
        </h1>

        {/* Order Summary */}
        <div className="mb-10">
          <h2 className={`text-2xl font-bold text-${colors.primaryDark} mb-4`}>Sipariş Özeti</h2>

          {cart.length === 0 && (
            <div className="p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
              Sepetinizde ürün bulunmuyor.
            </div>
          )}

          {cart.map((item, index) => (
            <div key={index} className={`p-4 mb-3 rounded-xl border-2 border-${colors.border} bg-${colors.bgLight}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className={`text-${colors.text}`}>{item.qty} × {formatCurrency(item.price)}</p>
                </div>
                <p className={`font-bold text-${colors.primaryDark}`}>{formatCurrency(item.qty * item.price)}</p>
              </div>
            </div>
          ))}

          <div className="mt-6 space-y-2 text-right">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Ara Toplam</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Vergi (18%)</span>
              <span>{formatCurrency(taxTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Kargo</span>
              <span>{shippingFee === 0 ? 'Ücretsiz' : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-2 border-t pt-2">
              <span>Genel Toplam</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Address */}
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>
              Teslimat Bilgileri
            </label>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Ad Soyad"
                className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:ring-2 focus:ring-${colors.primary}`}
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon"
                className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:ring-2 focus:ring-${colors.primary}`}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Şehir"
                className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:ring-2 focus:ring-${colors.primary}`}
              />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Teslimat notu (opsiyonel)"
                className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:ring-2 focus:ring-${colors.primary}`}
              />
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:ring-2 focus:ring-${colors.primary}`}
              placeholder="Adresinizi girin"
            />
          </div>

          {/* CREDIT CARD AREA */}
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className={`text-xl font-bold text-${colors.primaryDark} mb-4`}>Kredi Kartı Bilgileri</h3>

            <div className="space-y-4">

              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                placeholder="Kart Üzerindeki İsim"
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 16))}
                required
                placeholder="Kart Numarası (16 hane)"
                className="w-full px-4 py-3 border rounded-lg"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) =>
                    setExpiry(
                      e.target.value
                        .replace(/[^0-9]/g, "")
                        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
                        .slice(0, 5)
                    )
                  }
                  required
                  placeholder="SKT (AA/YY)"
                  className="px-4 py-3 border rounded-lg"
                />

                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCVV(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                  required
                  placeholder="CVV"
                  className="px-4 py-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className={`w-full px-8 py-4 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Sipariş Veriliyor..." : "Siparişi Tamamla"}
          </button>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("olamadı")
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
  