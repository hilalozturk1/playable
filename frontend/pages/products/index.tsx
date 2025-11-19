import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProductsPage() {
  const router = useRouter();
  const { colors } = useTheme();
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token') || localStorage.getItem('userEmail');
    if (!token) {
      router.replace('/login');
    }
  }, []);
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>((router.query.category as string) || '');
  const [searchQuery, setSearchQuery] = useState<string>((router.query.q as string) || '');

  useEffect(() => {
    // Load categories
    api.get('/products?limit=200').then(r => {
      const allProducts = r.data.products || r.data || [];
      const uniqueCategories = Array.from(new Set(allProducts.map((p: any) => p.category).filter(Boolean)));
      setCategories(uniqueCategories as string[]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const q = router.query.q as string || searchQuery;
    const category = router.query.category as string || selectedCategory;
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', '12');
    if (q) params.append('q', q);
    if (category) params.append('category', category);
    
    api.get(`/products?${params.toString()}`).then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total || 0);
    }).catch(() => {});
  }, [router.query, page, searchQuery, selectedCategory]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? '' : cat);
    setPage(1);
    router.push({
      pathname: '/products',
      query: { ...router.query, category: cat === selectedCategory ? '' : cat, page: 1 }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    router.push({
      pathname: '/products',
      query: { ...router.query, q: searchQuery, page: 1 }
    });
  };

  return (
    <div className={`py-10 px-6 bg-gradient-to-b from-${colors.bg} to-white`}>
      <div className="max-w-7xl mx-auto">
        <div className={`mb-10 bg-gradient-to-r from-${colors.primaryLight} to-${colors.secondary} rounded-2xl p-8 shadow-xl border-4 border-${colors.primaryDark}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">Tüm Ürünler</h1>
          <p className={`text-lg text-white/90 font-bold`}>{total} ürün mevcut</p>
        </div>

        {/* Search and Filters */}
        <div className={`mb-8 bg-white rounded-2xl p-6 shadow-lg border-4 border-${colors.border}`}>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün ara..."
                className={`flex-1 px-4 py-3 border-2 border-${colors.border} rounded-full focus:outline-none focus:ring-2 focus:ring-${colors.primary} transition-all`}
              />
              <button
                type="submit"
                className={`px-8 py-3 bg-${colors.primary} text-white rounded-full font-bold hover:bg-${colors.primaryDark} transition-all shadow-lg`}
              >
                Ara
              </button>
            </div>
          </form>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h3 className={`text-lg font-bold text-${colors.text} mb-3`}>Kategoriler</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${
                    !selectedCategory
                      ? `bg-${colors.primary} text-white border-2 border-${colors.primaryDark}`
                      : `bg-white text-${colors.primaryDark} border-2 border-${colors.border} hover:bg-${colors.bgLight}`
                  }`}
                >
                  Tümü
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${
                      selectedCategory === cat
                        ? `bg-${colors.primary} text-white border-2 border-${colors.primaryDark}`
                        : `bg-white text-${colors.primaryDark} border-2 border-${colors.border} hover:bg-${colors.bgLight}`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12">
          {products.length === 0 ? (
            <div className={`col-span-full text-center py-12 bg-white rounded-2xl border-4 border-${colors.border}`}>
              <p className={`text-lg text-${colors.primaryDark} font-bold`}>Ürün bulunamadı.</p>
            </div>
          ) : (
            products.map(p => <ProductCard key={p._id} product={p} small />)
          )}
        </div>
        <div className={`flex justify-between items-center pt-6 border-t-4 border-${colors.border} bg-white/80 rounded-xl p-6 shadow-lg`}>
          <div className={`text-base text-${colors.primaryDark} font-bold`}>{total} sonuç</div>
          <div className="space-x-3">
            <button 
              onClick={() => setPage(Math.max(1, page-1))} 
              disabled={page === 1}
              className={`px-6 py-3 border-2 border-${colors.primary} rounded-full text-sm font-bold text-${colors.primaryDark} bg-white hover:bg-${colors.bgLight} disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all`}
            >
              Önceki
            </button>
            <button 
              onClick={() => setPage(page+1)} 
              disabled={products.length < 12}
              className={`px-6 py-3 bg-${colors.primary} text-white rounded-full text-sm font-bold hover:bg-${colors.primaryDark} disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all`}
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
