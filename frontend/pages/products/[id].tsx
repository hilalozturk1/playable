import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProductPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = router.query;
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token') || localStorage.getItem('userEmail');
    if (!token) router.replace('/login');
  }, []);
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => {});
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const q = Math.max(1, Math.floor(qty || 1));
    try {
      const raw = localStorage.getItem('cart');
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((it: any) => it.id === product._id);
      if (existing) {
        existing.qty = Math.min(999, existing.qty + q);
      } else {
        cart.push({ id: product._id, name: product.name, price: product.price, qty: q });
      }
  localStorage.setItem('cart', JSON.stringify(cart));
  // dispatch a custom event so same-window components (header) can update immediately
  try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart })); } catch {}
  // non-blocking notification
  try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: `${product.name} added to cart (${q})` } })); } catch {}
  router.push('/cart');
    } catch (err) {
      console.error('Add to cart failed', err);
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'error', message: 'Failed to add to cart' } })); } catch {}
    }
  };

  if (!product) return (
    <div className="py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-lg text-gray-600 font-light">Loading...</div>
      </div>
    </div>
  );

  return (
    <div className={`py-12 px-6 bg-gradient-to-b from-${colors.bg} to-white`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            {product.images && product.images.length > 0 ? (
              <ImageGallery images={product.images} title={product.name} />
            ) : (
              <div className={`h-96 bg-${colors.bgLight} rounded-lg flex items-center justify-center text-${colors.primary} border-4 border-${colors.border}`}>Görsel Yok</div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-6`}>{product.name}</h1>
            <div className={`text-4xl font-bold text-${colors.primary} mb-8`}>${product.price}</div>
            {product.description && (
              <p className={`text-lg text-${colors.primaryDark} mb-8 font-semibold leading-relaxed`}>{product.description}</p>
            )}
            <div className="flex items-center gap-4 mb-8">
              <input 
                type="number" 
                value={qty} 
                min={1} 
                onChange={e => setQty(parseInt(e.target.value || '1'))} 
                className={`w-24 px-4 py-3 border-2 border-${colors.border} rounded-full text-center focus:outline-none focus:ring-2 focus:ring-${colors.primary} font-bold`} 
              />
              <button 
                onClick={handleAddToCart} 
                className={`flex-1 px-8 py-3 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-lg hover:shadow-xl`}
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const { colors } = useTheme();
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={images[current]} 
          alt={title} 
          className={`w-full h-[500px] md:h-[600px] object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity border-4 border-${colors.border}`} 
          onClick={() => setOpen(true)} 
        />
        {images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                key={i} 
                src={src} 
                alt={`thumb-${i}`} 
                onClick={() => setCurrent(i)} 
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  i === current ? `border-${colors.primaryDark}` : `border-transparent hover:border-${colors.border}`
                }`} 
              />
            ))}
          </div>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="max-w-5xl max-h-[90vh] overflow-hidden relative" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[current]} alt={title} className="w-full h-auto rounded-lg" />
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrent((current - 1 + images.length) % images.length); }} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 text-gray-900 w-12 h-12 flex items-center justify-center text-2xl rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                >
                  ‹
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrent((current + 1) % images.length); }} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 text-gray-900 w-12 h-12 flex items-center justify-center text-2xl rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                >
                  ›
                </button>
              </>
            )}
            <div className="flex gap-2 mt-4 justify-center">
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  key={i} 
                  src={src} 
                  alt={`thumb-${i}`} 
                  onClick={() => setCurrent(i)} 
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    i === current ? 'border-white' : 'border-transparent hover:border-gray-400'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
