import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api'

export default function AdminEditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.role !== 'admin') router.replace('/');
      }
    } catch {
      router.replace('/');
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const r = await api.get(`/products/${id}`);
      const p = r.data;
      setName(p.name || '');
      setDescription(p.description || '');
      setPrice(p.price || 0);
      setStock(p.stock || 0);
      setCategory(p.category || '');
      setImages(p.images || []);
    } catch (err) {
      console.error('Failed to load product', err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: 'Failed to load product' } })); } catch {}
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!name.trim()) return tryNotify('error', 'Name is required');
    if (!category.trim()) return tryNotify('error', 'Category is required');
    if (!(price > 0)) return tryNotify('error', 'Price must be greater than 0');
    if (!(stock >= 0)) return tryNotify('error', 'Stock must be 0 or greater');
    if (images.length === 0) return tryNotify('error', 'Please add at least one image');
    try {
      const token = localStorage.getItem('token');
      const body = { name, description, price, stock, category, images } as any;
      await api.put(`/admin/products/${id}`, body, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: 'Product updated' } })); } catch {}
      router.replace('/admin/products');
    } catch (err: any) {
      console.error('Update product failed', err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: err?.response?.data?.message || 'Update failed' } })); } catch {}
    }
  };

  function tryNotify(type: 'success'|'error'|'info'|'warn', message: string) {
    try { window.dispatchEvent(new CustomEvent('notify', { detail: { type, message } })); } catch {}
    return;
  }

  if (loading) {
    return (
      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-lg text-rose-600 font-bold">Loading product...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-rose-900 mb-12 drop-shadow-md">Ürün Düzenle</h1>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-rose-900 mb-2">İsim *</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full px-4 py-3 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all bg-white" 
              placeholder="Ürün ismi"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-rose-900 mb-2">Açıklama</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4}
              className="w-full px-4 py-3 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none bg-white" 
              placeholder="Ürün açıklaması"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-rose-900 mb-2">Fiyat *</label>
              <input 
                type="number" 
                step="0.01"
                value={price} 
                onChange={e => setPrice(parseFloat(e.target.value || '0'))} 
                className="w-full px-4 py-3 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all bg-white" 
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-rose-900 mb-2">Stok</label>
              <input 
                type="number" 
                value={stock} 
                onChange={e => setStock(parseInt(e.target.value || '0'))} 
                className="w-full px-4 py-3 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all bg-white" 
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-rose-900 mb-2">Kategori *</label>
              <input 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full px-4 py-3 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all bg-white" 
                placeholder="Kategori"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-rose-900 mb-2">Görseller * (en az bir görsel gerekli - birden fazla seçebilirsiniz)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                setUploading(true);
                const toDataUrl = (f: File) => new Promise<string>((res, rej) => {
                  const reader = new FileReader();
                  reader.onload = () => res(String(reader.result));
                  reader.onerror = rej;
                  reader.readAsDataURL(f);
                });
                try {
                  const arr: string[] = [];
                  for (let i = 0; i < files.length; i++) {
                    const dataUrl = await toDataUrl(files[i]);
                    arr.push(dataUrl);
                  }
                  setImages(prev => [...prev, ...arr]);
                } finally {
                  setUploading(false);
                }
              }} 
              className="w-full px-4 py-3 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all bg-white" 
            />
            {uploading && <div className="text-sm text-rose-600 mt-2 font-semibold">Görseller işleniyor...</div>}
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((src, idx) => (
                  <div key={idx} className="relative w-24 h-24 bg-rose-50 rounded-lg overflow-hidden border-2 border-rose-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`img-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-all font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="submit"
              className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl"
            >
              Ürünü Güncelle
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-rose-400 text-rose-700 rounded-full font-bold hover:bg-rose-50 transition-all"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

