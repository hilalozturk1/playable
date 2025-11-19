import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    api.get('/products?limit=6&sort=popular').then(r => setBestSellers(r.data.products)).catch(() => {});
    api.get('/products?limit=6&sort=rating_desc').then(r => setTopRated(r.data.products)).catch(() => {});
    // Load categories
    api.get('/products?limit=200').then(r => {
      const allProducts = r.data.products || r.data || [];
      const uniqueCategories = Array.from(new Set(allProducts.map((p: any) => p.category).filter(Boolean)));
      setCategories(uniqueCategories as string[]);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <div>
      {/* Search and Category Bar */}
      <section className={`bg-gradient-to-r from-${colors.primaryLight} to-${colors.secondary} border-b-4 border-${colors.primaryDark} shadow-xl`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-2xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className={`flex-1 px-6 py-4 border-4 border-${colors.primaryDark} rounded-full focus:outline-none focus:ring-4 focus:ring-${colors.accent} transition-all text-lg font-semibold shadow-lg`}
                />
                <button
                  type="submit"
                  className={`px-8 py-4 bg-white text-${colors.primaryDark} rounded-full font-bold hover:opacity-90 transition-all shadow-xl hover:shadow-2xl text-lg`}
                >
                  Ara
                </button>
              </div>
            </form>

            {/* Quick Category Links */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className={`px-5 py-2 bg-white/90 text-${colors.primaryDark} rounded-full font-bold hover:bg-white transition-all shadow-md hover:shadow-lg text-sm border-2 border-${colors.border}`}
                  >
                    {cat}
                  </Link>
                ))}
                {categories.length > 4 && (
                  <Link
                    href="/products"
                    className={`px-5 py-2 bg-${colors.primaryDark} text-white rounded-full font-bold hover:opacity-90 transition-all shadow-md hover:shadow-lg text-sm border-2 border-${colors.primaryDark}`}
                  >
                    Tümü →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className={`relative w-full h-[600px] md:h-[700px] bg-${colors.bgLight} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl mx-auto z-10">
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight text-${colors.text} mb-6 drop-shadow-lg`}>
              Rahat Pijamalar
              <br />
              <span className={`text-${colors.primaryDark}`}>Konforlu Uyku</span>
            </h1>
            <p className={`text-xl md:text-2xl text-${colors.primaryDark} mb-8 font-semibold`}>
              Yumuşak dokular ve şık tasarımlarla gününüzü tamamlayın
            </p>
            <Link 
              href="/products" 
              className={`inline-block px-10 py-5 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-xl hover:shadow-2xl text-lg`}
            >
              Hemen Alışverişe Başla
            </Link>
          </div>
        </div>
        <div className={`absolute inset-0 opacity-10 bg-${colors.accent}`} />
      </section>

      {/* Best Sellers Section */}
      <section className={`py-16 px-6 bg-${colors.bg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-4`}>En Çok Sipariş Edilenler</h2>
            <p className={`text-lg text-${colors.primaryDark} font-semibold`}>Müşterilerimizin favori pijama takımları</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            {bestSellers.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="text-center">
            <Link 
              href="/products?sort=popular" 
              className={`inline-block px-10 py-4 border-3 border-${colors.primary} text-${colors.primaryDark} rounded-full font-bold hover:bg-${colors.primary} hover:text-white transition-all shadow-lg`}
            >
              Popülerleri Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-4`}>En Yüksek Puanlılar</h2>
            <p className={`text-lg text-${colors.primaryDark} font-semibold`}>Kullanıcı değerlendirmelerine göre seçtik</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10">
            {topRated.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="text-center">
            <Link 
              href="/products?sort=rating_desc" 
              className={`inline-block px-10 py-4 border-3 border-${colors.primary} text-${colors.primaryDark} rounded-full font-bold hover:bg-${colors.primary} hover:text-white transition-all shadow-lg`}
            >
              Yüksek Puanlıları Gör →
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Section */}
      <section className={`py-16 px-6 bg-${colors.bgLight}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className={`bg-white/80 p-6 rounded-xl shadow-lg border-2 border-${colors.border}`}>
              <h3 className={`text-2xl font-bold text-${colors.text} mb-3`}>Yumuşak Kumaş</h3>
              <p className={`text-${colors.primaryDark} font-medium`}>%100 pamuklu, nefes alan kumaşlar</p>
            </div>
            <div className={`bg-white/80 p-6 rounded-xl shadow-lg border-2 border-${colors.border}`}>
              <h3 className={`text-2xl font-bold text-${colors.text} mb-3`}>Rahat Kesim</h3>
              <p className={`text-${colors.primaryDark} font-medium`}>Vücudunuza mükemmel uyum sağlayan tasarım</p>
            </div>
            <div className={`bg-white/80 p-6 rounded-xl shadow-lg border-2 border-${colors.border}`}>
              <h3 className={`text-2xl font-bold text-${colors.text} mb-3`}>Kaliteli Üretim</h3>
              <p className={`text-${colors.primaryDark} font-medium`}>Uzun ömürlü ve dayanıklı ürünler</p>
            </div>
          </div>
          <div className="text-center">
            <h2 className={`text-4xl md:text-5xl font-bold text-${colors.text} mb-4`}>Güvenilir Kalite</h2>
            <p className={`text-lg text-${colors.primaryDark} font-semibold max-w-2xl mx-auto`}>
              Her ürün en yüksek kalite ve konfor standartlarını sağlamak için özenle seçilmiştir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
