import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: any;
  createdAt?: string;
};

export default function ProfilePage() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

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
    <div className={`py-12 px-6 bg-gradient-to-b from-${colors.bg} to-white`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-12 drop-shadow-md`}>Profil</h1>
        
        <div className={`mb-12 bg-gradient-to-r from-${colors.primaryLight} to-${colors.secondary} rounded-2xl p-8 shadow-xl border-4 border-${colors.primaryDark}`}>
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
              <div className={`text-center py-12 bg-white rounded-2xl border-4 border-${colors.border} shadow-lg`}>
                <p className={`text-lg text-${colors.primaryDark} font-bold mb-4`}>Henüz siparişiniz yok.</p>
                <a href="/products" className={`inline-block px-10 py-4 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-xl`}>
                  Alışverişe Başla
                </a>
              </div>
            )}
            {!loading && !error && orders && orders.length > 0 && (
              <div className="space-y-6">
                {orders.map(o => (
                  <div key={o._id} className={`p-6 bg-white border-4 border-${colors.border} rounded-2xl hover:shadow-2xl transition-all shadow-lg`}>
                    <div className={`flex justify-between items-center mb-6 pb-4 border-b-2 border-${colors.border}`}>
                      <div>
                        <div className={`text-sm text-${colors.primary} mb-1 font-bold`}>Sipariş ID</div>
                        <div className={`text-sm font-bold text-${colors.text}`}>{o._id}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm text-${colors.primary} mb-1 font-bold`}>Tarih</div>
                        <div className={`text-sm font-bold text-${colors.text}`}>
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString('tr-TR') : ''}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      {o.items.map((it, idx) => (
                        <div key={idx} className={`flex justify-between items-center py-3 px-4 bg-${colors.bgLight} rounded-lg border-2 border-${colors.border}`}>
                          <div>
                            <div className={`font-bold text-${colors.text}`}>{it.name || 'Ürün'}</div>
                            <div className={`text-sm text-${colors.primary} font-semibold`}>Adet: {it.quantity}</div>
                          </div>
                          <div className={`font-bold text-${colors.primaryDark} text-lg`}>${(it.price || 0).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={`pt-4 border-t-2 border-${colors.border} flex justify-between items-center bg-gradient-to-r from-${colors.bgLight} to-${colors.bg} rounded-lg p-4`}>
                      <span className={`text-xl font-bold text-${colors.text}`}>Toplam</span>
                      <span className={`text-3xl font-bold text-${colors.primaryDark}`}>${(o.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
