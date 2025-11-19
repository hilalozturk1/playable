import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/categories');
      setCategories(r.data.categories || r.data || []);
    } catch (err) { console.error('Failed to load categories', err); }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/categories/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: 'Kategori silindi' } })); } catch {}
      load();
    } catch (err: any) {
      console.error('Delete failed', err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: err?.response?.data?.message || 'Silme başarısız' } })); } catch {}
    }
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kategoriler</h1>
          <button onClick={() => router.push('/admin/categories/new')} className="px-4 py-2 bg-blue-600 text-white rounded">Yeni Kategori</button>
        </div>
        {loading ? <div>Yükleniyor...</div> : (
          <ul className="bg-white rounded shadow divide-y">
            {categories.map((c: any) => (
              <li key={c._id} className="flex justify-between items-center px-4 py-3">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.slug}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/admin/categories/${c._id}`)} className="px-3 py-1 border rounded">Düzenle</button>
                  <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-500 text-white rounded">Sil</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
