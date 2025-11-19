"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import { useTheme } from "../contexts/ThemeContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { colors } = useTheme();

  const [address, setAddress] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // KART ALANI STATE
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token =
      localStorage.getItem("token") || localStorage.getItem("userEmail");
    if (!token) router.replace("/login");

    const rawCart = localStorage.getItem("cart");
    if (rawCart) {
      const items = JSON.parse(rawCart);
      setCart(items);
      setTotal(items.reduce((s: number, it: any) => s + it.price * it.qty, 0));
    }
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

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/orders",
        {
          items: cart,
          total,
          shippingAddress: { address },
          paymentInfo: {
            cardName,
            cardNumber: "**** **** **** " + cardNumber.slice(-4),
            expiry,
          },
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setMessage("Sipariş oluşturuldu! (Simülasyon)");
      localStorage.removeItem("cart");

      try {
        window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));
      } catch {}

      try {
        window.dispatchEvent(
          new CustomEvent("notify", {
            detail: { type: "success", message: "Sipariş başarıyla oluşturuldu!" },
          })
        );
      } catch {}

      setTimeout(() => router.replace("/profile"), 800);
    } catch (err) {
      console.error(err);
      setMessage("Sipariş oluşturulamadı");
    }
    setLoading(false);
  };

  return (
    <div className={`py-12 px-6 bg-gradient-to-b from-${colors.bgLight} to-white min-h-screen`}>
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border">
        <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-10 text-center`}>
          Ödeme
        </h1>

        {/* Order Summary */}
        <div className="mb-10">
          <h2 className={`text-2xl font-bold text-${colors.primaryDark} mb-4`}>Sipariş Özeti</h2>

          {cart.map((item, index) => (
            <div key={index} className={`p-4 mb-3 rounded-xl border-2 border-${colors.border} bg-${colors.bgLight}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className={`text-${colors.text}`}>{item.qty} × {item.price} TL</p>
                </div>
                <p className={`font-bold text-${colors.primaryDark}`}>{item.qty * item.price} TL</p>
              </div>
            </div>
          ))}

          <div className="flex justify-between text-xl font-bold mt-6">
            <p>Toplam:</p>
            <p className={`text-${colors.primaryDark}`}>{total} TL</p>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Address */}
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>
              Kargo Adresi
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:ring-2 focus:ring-${colors.primary}`}
              placeholder="Kargo adresinizi girin"
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
            disabled={loading}
            className={`w-full px-8 py-4 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} shadow-lg`}
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
  