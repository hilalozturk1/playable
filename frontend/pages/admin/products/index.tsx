import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';
import { useTheme } from '../../../contexts/ThemeContext';

export default function AdminProductsList() {
  const router = useRouter();
  const { colors } = useTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    load(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const load = async (p = 1, q = '') => {
    setLoading(true);
    try {
      const params: any = { page: p, limit };
      if (q && q.trim()) params.q = q.trim();
      const r = await api.get('/products', { params });
      setProducts(r.data.products || r.data || []);
      setTotal(r.data.total || 0);
      setPage(r.data.page || p);
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
      load(page, search);
    } catch (err: any) {
      console.error('Delete failed', err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: err?.response?.data?.message || 'Delete failed' } })); } catch {}
    }
  };

  const totalPages = Math.max(1, Math.ceil((total || products.length) / limit));

  return (
    <div className={`py-12 px-6 bg-${colors.bg}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 bg-${colors.primaryLight} rounded-xl p-6 shadow-xl border-4 border-${colors.primaryDark}`}>
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-4 md:mb-0">Admin - Ürünler</h1>
          <div className="flex gap-3 w-full md:w-auto items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); load(1, search); } }}
              placeholder="Ürün ara..."
              className="px-3 py-2 rounded w-full md:w-64"
            />
            <button onClick={() => { setPage(1); load(1, search); }} className="px-4 py-2 bg-white text-black rounded">Ara</button>
            <button onClick={() => router.push('/admin/products/new')} className={`px-4 py-2 bg-white text-${colors.primaryDark} rounded font-bold`}>Yeni Ürün</button>
          </div>
        </div>

        {loading ? (
          <div className={`text-center py-12 bg-white rounded-xl border-4 border-${colors.border}`}>
            <div className={`text-lg text-${colors.primaryDark} font-bold`}>Ürünler yükleniyor...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p._id} className={`p-6 bg-white border-4 border-${colors.border} rounded-xl hover:shadow-2xl transition-all shadow-lg`}>
                  <div className={`h-48 bg-${colors.bgLight} rounded-xl mb-4 overflow-hidden flex items-center justify-center border-2 border-${colors.border}`}>
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

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">Toplam: {total || products.length} ürün</div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Önceki</button>
                <div className="px-3 py-1">{page} / {totalPages}</div>
                <button className="px-3 py-1 border rounded" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Sonraki</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
