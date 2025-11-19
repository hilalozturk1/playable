import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';
import { useTheme } from '../../../contexts/ThemeContext';

export default function AdminProductsList() {
  const router = useRouter();
  const { colors } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/products?limit=200');
      setProducts(r.data.products || r.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/products/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: 'Product deleted' } })); } catch {}
      load();
    } catch (err: any) {
      console.error('Delete failed', err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: err?.response?.data?.message || 'Delete failed' } })); } catch {}
    }
  };

  return (
    <div className={`py-12 px-6 bg-gradient-to-b from-${colors.bg} to-white`}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex justify-between items-center mb-12 bg-gradient-to-r from-${colors.primaryLight} to-${colors.secondary} rounded-2xl p-8 shadow-xl border-4 border-${colors.primaryDark}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Admin - Ürünler</h1>
          <button 
            onClick={() => router.push('/admin/products/new')} 
            className={`px-6 py-3 bg-white text-${colors.primaryDark} rounded-full font-bold hover:opacity-90 transition-all shadow-xl hover:shadow-2xl`}
          >
            Yeni Ürün Ekle
          </button>
        </div>
        {loading ? (
          <div className={`text-center py-12 bg-white rounded-2xl border-4 border-${colors.border}`}>
            <div className={`text-lg text-${colors.primaryDark} font-bold`}>Ürünler yükleniyor...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p._id} className={`p-6 bg-white border-4 border-${colors.border} rounded-2xl hover:shadow-2xl transition-all shadow-lg`}>
                <div className={`h-48 bg-gradient-to-br from-${colors.bgLight} to-${colors.bg} rounded-xl mb-4 overflow-hidden flex items-center justify-center border-2 border-${colors.border}`}>
                  {p.images && p.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`text-${colors.primary} font-bold`}>Görsel Yok</div>
                  )}
                </div>
                <div className={`font-bold text-${colors.text} mb-2`}>{p.name}</div>
                <div className={`text-lg font-bold text-${colors.primary} mb-4`}>${p.price}</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => router.push(`/admin/products/${p._id}`)} 
                    className={`flex-1 px-4 py-2 text-sm font-bold text-${colors.primaryDark} border-2 border-${colors.primary} rounded-full hover:bg-${colors.bgLight} transition-all`}
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => router.push(`/products/${p._id}`)} 
                    className={`flex-1 px-4 py-2 text-sm font-bold text-white bg-${colors.primary} rounded-full hover:bg-${colors.primaryDark} transition-all`}
                  >
                    Görüntüle
                  </button>
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition-all"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
