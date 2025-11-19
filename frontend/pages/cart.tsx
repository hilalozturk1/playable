import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';

type CartItem = { id: string; name: string; price: number; qty: number; image?: string };

export default function CartPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }),
    []
  );
  const formatPrice = (value: number) => currencyFormatter.format(value || 0);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token') || localStorage.getItem('userEmail');
    if (!token) router.replace('/login');
  }, []);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items })); } catch {}
  }, [items]);

  const updateQty = (id: string, qty: number) => {
    const q = Math.max(1, isNaN(qty) ? 1 : Math.floor(qty));
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: q } : i));
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className={`py-12 px-6 bg-${colors.bg}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-12 drop-shadow-md`}>Sepet</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-xl text-${colors.primaryDark} mb-6 font-bold`}>Sepetiniz boş.</p>
            <Link href="/products" className={`inline-block px-8 py-4 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-xl`}>
              Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map(it => (
              <div key={it.id} className={`p-6 bg-white border-4 border-${colors.border} rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-2xl transition-all shadow-lg`}>
                <div className="flex items-center gap-4 flex-1 w-full">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Görsel yok</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold text-lg text-${colors.text} mb-2`}>{it.name}</div>
                    <div className={`text-sm text-${colors.primary}`}>Birim: {formatPrice(it.price)}</div>
                    <div className={`text-base text-${colors.text} font-bold mt-1`}>Toplam: {formatPrice(it.price * it.qty)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    value={it.qty} 
                    min={1} 
                    onChange={e => updateQty(it.id, parseInt(e.target.value || '1'))} 
                    className={`w-20 px-3 py-2 border-2 border-${colors.border} rounded-full text-center focus:outline-none focus:ring-2 focus:ring-${colors.primary}`} 
                  />
                  <button 
                    onClick={() => removeItem(it.id)} 
                    className={`px-4 py-2 text-sm font-bold text-${colors.primaryDark} border-2 border-${colors.border} rounded-full hover:bg-${colors.bgLight} transition-all`}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
            <div className={`mt-8 pt-8 border-t-4 border-${colors.border} bg-white/80 rounded-xl p-6 shadow-lg`}>
              <div className="flex justify-between items-center mb-6">
                <span className={`text-xl font-bold text-${colors.text}`}>Ara Toplam</span>
                <span className={`text-3xl font-bold text-${colors.primaryDark}`}>{formatPrice(subtotal)}</span>
              </div>
              <div className="text-right">
                <Link 
                  href="/checkout" 
                  className={`inline-block px-8 py-4 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-lg hover:shadow-xl`}
                >
                  Ödemeye Geç →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
