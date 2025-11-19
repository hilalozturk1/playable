import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

export default function EditCategory() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { if (id) load(); }, [id]);

  useEffect(() => {
    if (!slugEdited) {
      const s = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 100);
      setSlug(s);
    }
  }, [name, slugEdited]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/categories/${id}`);
      const c = r.data;
      setName(c.name || '');
      setSlug(c.slug || '');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await api.put(`/categories/${id}`, { name, slug }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: 'Kategori güncellendi' } })); } catch {}
      router.push('/admin/categories');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Güncelleme başarısız';
      setError(msg);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: msg } })); } catch {}
    }
  };

  if (loading) return <div className="py-12 px-6">Yükleniyor...</div>;

  return (
    <div className="py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Kategori Düzenle</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">İsim</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-semibold">Slug</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Güncelle</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => router.back()}>İptal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
