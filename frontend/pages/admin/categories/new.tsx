import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

export default function NewCategory() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slugEdited) {
      const s = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 100);
      setSlug(s);
    }
  }, [name, slugEdited]);
  const submit = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) {
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: 'İsim gerekli' } })); } catch {}
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/categories', { name, slug }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: 'Kategori oluşturuldu' } })); } catch {}
      router.push('/admin/categories');
    } catch (err: any) {
      console.error(err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: err?.response?.data?.message || 'Oluşturulamadı' } })); } catch {}
      const msg = err?.response?.data?.message || 'Oluşturulamadı';
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Yeni Kategori</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">İsim</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          
            <label className="block text-sm font-semibold">Slug (opsiyonel)</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full border px-3 py-2 rounded" />
            <input value={slug} onChange={e => { setSlug(e.target.value); setSlugEdited(true); }} className="w-full border px-3 py-2 rounded" />
          <div className="flex gap-3">
          {error && <div className="text-sm text-red-600">{error}</div>}
            <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading || !name.trim()}>{loading ? 'Oluşturuluyor...' : 'Oluştur'}</button>
            <button type="button" className="px-4 py-2 border rounded" onClick={() => router.back()}>İptal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
