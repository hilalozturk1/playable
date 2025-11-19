import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';
import { useTheme } from '../../../contexts/ThemeContext';

export default function AdminNewProduct() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    // quick check for admin role
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

  const submit = async (e: any) => {
    e.preventDefault();
    // client-side validation
    if (!name.trim()) return tryNotify('error', 'Name is required');
    if (!category.trim()) return tryNotify('error', 'Category is required');
    if (!(price > 0)) return tryNotify('error', 'Price must be greater than 0');
    if (!(stock >= 0)) return tryNotify('error', 'Stock must be 0 or greater');
    if (images.length === 0) return tryNotify('error', 'Please add at least one image');
    try {
      const token = localStorage.getItem('token');
  const body = { name, description, price, stock, category, images } as any;
      await api.post('/admin/products', body, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: 'Product created' } })); } catch {}
      router.replace('/products');
    } catch (err: any) {
      console.error('Create product failed', err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: err?.response?.data?.message || 'Create failed' } })); } catch {}
    }
  };

  function tryNotify(type: 'success'|'error'|'info'|'warn', message: string) {
    try { window.dispatchEvent(new CustomEvent('notify', { detail: { type, message } })); } catch {}
    return;
  }

  return (
    <div className={`py-12 px-6 bg-gradient-to-b from-${colors.bg} to-white`}>
      <div className={`max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-xl border-4 border-${colors.border}`}>
        <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-12`}>Yeni Ürün Oluştur</h1>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>İsim *</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
              placeholder="Ürün adı"
            />
          </div>
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>Açıklama</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={4}
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all resize-none`} 
              placeholder="Ürün açıklaması"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-bold text-${colors.text} mb-2`}>Fiyat *</label>
              <input 
                type="number" 
                step="0.01"
                value={price} 
                onChange={e => setPrice(parseFloat(e.target.value || '0'))} 
                className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={`block text-sm font-bold text-${colors.text} mb-2`}>Stok</label>
              <input 
                type="number" 
                value={stock} 
                onChange={e => setStock(parseInt(e.target.value || '0'))} 
                className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
                placeholder="0"
              />
            </div>
            <div>
              <label className={`block text-sm font-bold text-${colors.text} mb-2`}>Kategori *</label>
              <input 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
                placeholder="Kategori"
              />
            </div>
          </div>
          <div>
            <label className={`block text-sm font-bold text-${colors.text} mb-2`}>Görseller * (gerekli - birden fazla seçebilirsiniz)</label>
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
                    // limit to reasonable size per image (client-side)
                    const dataUrl = await toDataUrl(files[i]);
                    arr.push(dataUrl);
                  }
                  setImages(prev => [...prev, ...arr]);
                } finally {
                  setUploading(false);
                }
              }} 
              className={`w-full px-4 py-3 border-2 border-${colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`} 
            />
            {uploading && <div className={`text-sm text-${colors.primaryDark} mt-2 font-semibold`}>Görseller işleniyor...</div>}
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((src, idx) => (
                  <div key={idx} className={`relative w-24 h-24 bg-${colors.bgLight} rounded-lg overflow-hidden border-2 border-${colors.border}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`img-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-all"
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
              className={`px-8 py-3 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-lg hover:shadow-xl`}
            >
              Ürün Oluştur
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className={`px-8 py-3 border-2 border-${colors.border} text-${colors.primaryDark} rounded-full font-bold hover:bg-${colors.bgLight} transition-all`}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
