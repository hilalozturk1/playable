import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  lineTotal?: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  subTotal?: number;
  taxTotal?: number;
  shippingFee?: number;
  grandTotal?: number;
  status?: string;
  shippingAddress?: {
    fullName?: string;
    city?: string;
    address?: string;
    phone?: string;
    notes?: string;
  };
  createdAt?: string;
  estimatedDelivery?: string;
};

export default function ProfilePage() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const e = localStorage.getItem('userEmail');
    setEmail(e);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/orders/my', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: 'Bearer ' + token } : {}),
          },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || res.statusText || 'Failed to fetch orders');
        }
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className={`py-12 px-6 bg-${colors.bg}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-12 drop-shadow-md`}>Profil</h1>
        
        <div className={`mb-12 bg-${colors.primaryLight} rounded-xl p-8 shadow-xl border-4 border-${colors.primaryDark}`}>
          <h2 className="text-2xl font-bold text-white mb-4">Hesap Bilgileri</h2>
          <div className={`p-6 bg-white/90 rounded-xl border-2 border-${colors.border}`}>
            <div className={`text-lg text-${colors.text} font-bold`}>{email || 'Giriş yapılmamış'}</div>
          </div>
        </div>

        <div>
          <h2 className={`text-3xl font-bold text-${colors.text} mb-6`}>Sipariş Geçmişi</h2>
          <div>
            {loading && (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600 font-light">Loading orders...</div>
              </div>
            )}
            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            {!loading && !error && orders && orders.length === 0 && (
              <div className={`text-center py-12 bg-white rounded-xl border-4 border-${colors.border} shadow-lg`}>
                <p className={`text-lg text-${colors.primaryDark} font-bold mb-4`}>Henüz siparişiniz yok.</p>
                <a href="/products" className={`inline-block px-10 py-4 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-xl`}>
                  Alışverişe Başla
                </a>
              </div>
            )}
            {!loading && !error && orders && orders.length > 0 && (
              <div className="space-y-6">
                {orders.map(o => {
                  const formatPrice = (value?: number) => currencyFormatter.format(value || 0);
                  const statusColor =
                    o.status === 'Teslim Edildi'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : o.status === 'Kargoya Verildi'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : o.status === 'İptal'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200';

                  return (
                    <div key={o._id} className={`p-6 bg-white border-4 border-${colors.border} rounded-xl hover:shadow-2xl transition-all shadow-lg`}>
                      <div className={`flex flex-wrap gap-4 justify-between items-center mb-6 pb-4 border-b-2 border-${colors.border}`}>
                        <div>
                          <div className={`text-sm text-${colors.primary} mb-1 font-bold`}>Sipariş ID</div>
                          <div className={`text-sm font-bold text-${colors.text}`}>{o._id}</div>
                          <div className="text-xs text-gray-500">
                            {o.createdAt ? new Date(o.createdAt).toLocaleString('tr-TR') : ''}
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-bold border ${statusColor}`}>
                          {o.status || 'Hazırlanıyor'}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className={`p-4 rounded-lg border-2 border-${colors.border} bg-${colors.bgLight}`}>
                          <h4 className={`text-sm font-bold text-${colors.text} mb-2`}>Gönderim Bilgileri</h4>
                          <p className={`text-${colors.text} font-semibold`}>{o.shippingAddress?.fullName || 'Belirtilmemiş'}</p>
                          <p className="text-sm text-gray-600">{o.shippingAddress?.address}</p>
                          <p className="text-sm text-gray-600">{o.shippingAddress?.city}</p>
                          {o.shippingAddress?.phone && (
                            <p className="text-sm text-gray-600 mt-1">Tel: {o.shippingAddress.phone}</p>
                          )}
                          {o.shippingAddress?.notes && (
                            <p className="text-xs text-gray-500 mt-1">Not: {o.shippingAddress.notes}</p>
                          )}
                          {o.estimatedDelivery && (
                            <p className="text-xs text-gray-500 mt-2">
                              Tahmini teslim: {new Date(o.estimatedDelivery).toLocaleDateString('tr-TR')}
                            </p>
                          )}
                        </div>

                        <div className={`p-4 rounded-lg border-2 border-${colors.border} bg-${colors.bgLight}`}>
                          <h4 className={`text-sm font-bold text-${colors.text} mb-2`}>Fiyat Özeti</h4>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Ürünler</span>
                            <span>{formatPrice(o.subTotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Vergi</span>
                            <span>{formatPrice(o.taxTotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Kargo</span>
                            <span>{(o.shippingFee || 0) === 0 ? 'Ücretsiz' : formatPrice(o.shippingFee)}</span>
                          </div>
                          <div className="flex justify-between text-base font-bold mt-2">
                            <span>Genel Toplam</span>
                            <span>{formatPrice(o.grandTotal)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {o.items.map((it, idx) => (
                          <div key={idx} className={`flex items-center gap-4 py-3 px-4 bg-${colors.bgLight} rounded-lg border-2 border-${colors.border}`}>
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                              {it.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Görsel yok</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold text-${colors.text}`}>{it.name || 'Ürün'}</div>
                              <div className={`text-sm text-${colors.primary} font-semibold`}>Adet: {it.quantity}</div>
                              <div className="text-xs text-gray-500">Birim: {formatPrice(it.price)}</div>
                            </div>
                            <div className={`font-bold text-${colors.primaryDark} text-lg`}>
                              {formatPrice(it.lineTotal || (it.price || 0) * (it.quantity || 1))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
