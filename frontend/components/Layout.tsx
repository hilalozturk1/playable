import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AdCarousel from './AdCarousel';
import ThemeSelector from './ThemeSelector';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';

type Toast = { id: string; type: 'info' | 'success' | 'warn' | 'error'; message: string };

export default function Layout({ children, title = 'Playable' }: any) {
  const { colors } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const e = localStorage.getItem('userEmail');
    setUserEmail(e);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setIsAdmin(payload.role === 'admin');
        }
      } catch {}
    }

    const raw = localStorage.getItem('cart');
    try {
      const cart = raw ? JSON.parse(raw) : [];
      const count = cart.reduce((s: number, it: any) => s + (it.qty || 0), 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'cart') {
        try {
          const cart = ev.newValue ? JSON.parse(ev.newValue) : [];
          const count = cart.reduce((s: number, it: any) => s + (it.qty || 0), 0);
          setCartCount(count);
        } catch {
          setCartCount(0);
        }
      }
      if (ev.key === 'userEmail') {
        setUserEmail(ev.newValue);
      }
      if (ev.key === 'token') {
        try {
          const t = ev.newValue;
          if (t) {
            const parts = t.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              setIsAdmin(payload.role === 'admin');
            }
          } else {
            setIsAdmin(false);
          }
        } catch {
          setIsAdmin(false);
        }
      }
    };

    const onCartUpdated = (e: any) => {
      const cart = e.detail || [];
      const count = cart.reduce((s: number, it: any) => s + (it.qty || 0), 0);
      setCartCount(count);
    };

    const onNotify = (e: any) => {
      const d = e.detail || {};
      const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
      const toast: Toast = { id, type: (d.type as any) || 'info', message: d.message || '' };
      setToasts(prev => [...prev, toast]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('cartUpdated', onCartUpdated as EventListener);
    window.addEventListener('notify', onNotify as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cartUpdated', onCartUpdated as EventListener);
      window.removeEventListener('notify', onNotify as EventListener);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('cart');
      // notify other tabs
      try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] })); } catch {}
      try { window.dispatchEvent(new CustomEvent('notify', { detail: { type: 'success', message: 'Logged out' } })); } catch {}
    }
    setUserEmail(null);
    setCartCount(0);
    router.replace('/login');
  };

  return (
    <div className="min-h-screen">
      <Head>
        <title>{title}</title>
      </Head>

      {/* Notification toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-white ${t.type === 'error' ? 'bg-red-600' : t.type === 'warn' ? 'bg-yellow-600 text-black' : t.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}>
            {t.message}
          </div>
        ))}
      </div>

        {/* Hide main header on admin routes to avoid duplicate nav */}
        {!router.pathname.startsWith('/admin') && (
          <header className={`bg-${colors.primaryLight} border-b-4 border-${colors.primaryDark} sticky top-0 z-30 backdrop-blur-sm shadow-lg`}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <Link href="/" className="font-bold text-3xl tracking-tight text-white hover:opacity-90 drop-shadow-md">Playable</Link>
              <nav className="space-x-6 flex items-center text-sm font-bold">
                <Link href="/" className="text-white hover:opacity-90 px-3 py-1 rounded-lg hover:bg-white/20 transition-all">Anasayfa</Link>
                <ThemeSelector />
                {userEmail && (
                  <>
                    <Link href="/products" className="text-white hover:opacity-90 font-bold text-sm px-3 py-1 rounded-lg hover:bg-white/20 transition-all">Ürünler</Link>
                    <Link href="/cart" className="text-white hover:opacity-90 font-bold text-sm relative px-3 py-1 rounded-lg hover:bg-white/20 transition-all">
                      Sepet
                      {cartCount > 0 && (
                        <span className={`absolute -top-1 -right-1 bg-${colors.primaryDark} text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white`}>{cartCount}</span>
                      )}
                    </Link>
                    <Link href="/profile" className="text-white hover:opacity-90 font-bold text-sm px-3 py-1 rounded-lg hover:bg-white/20 transition-all">Profil</Link>
                    {isAdmin && (
                      <>
                        <Link href="/admin/dashboard" className="text-white hover:opacity-90 font-bold text-sm px-3 py-1 rounded-lg hover:bg-white/20 transition-all">Admin Dashboard</Link>
                      </>
                    )}
                  </>
                )}
                {userEmail ? (
                  <>
                    <span className="ml-4 text-sm text-white font-semibold bg-white/20 px-3 py-1 rounded-lg">{userEmail}</span>
                    <button onClick={handleLogout} className={`ml-4 px-5 py-2 text-sm font-bold text-${colors.primaryDark} bg-white rounded-full hover:opacity-90 shadow-md transition-all`}>Çıkış</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-white hover:opacity-90 font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all">Giriş</Link>
                    <Link href="/register" className={`ml-2 px-5 py-2 text-sm font-bold text-${colors.primaryDark} bg-white rounded-full hover:opacity-90 shadow-md transition-all`}>Kayıt Ol</Link>
                  </>
                )}
              </nav>
            </div>
          </header>
        )}
        {/* Compact admin topbar for admin routes */}
        {router.pathname.startsWith('/admin') && (
          <div className="bg-white border-b shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
              <button onClick={() => { if (typeof window !== 'undefined' && window.history.length > 1) router.back(); else router.push('/admin/dashboard'); }} className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11a1 1 0 010-1.414l3.707-3.707a1 1 0 011.414 1.414L6.414 10l1.293 1.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
                Geri
              </button>
              <button onClick={() => router.push('/admin/dashboard')} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">Dashboard</button>
              <div className="ml-4 font-semibold text-sm">Admin Panel</div>
            </div>
          </div>
        )}
      <main className={`min-h-screen ${router.pathname.startsWith('/admin') ? '' : 'md:ml-64'}`}>{children}</main>
      <footer className={`border-t-4 border-${colors.accent} bg-${colors.primaryLight} mt-24 py-12 shadow-xl`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4 text-lg">Şirket</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li><Link href="/products" className="hover:text-white font-semibold">Ürünler</Link></li>
                <li><Link href="/about" className="hover:text-white font-semibold">Hakkımızda</Link></li>
                <li><Link href="/contact" className="hover:text-white font-semibold">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4 text-lg">Destek</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li><Link href="/help" className="hover:text-white font-semibold">Yardım Merkezi</Link></li>
                <li><Link href="/shipping" className="hover:text-white font-semibold">Kargo</Link></li>
                <li><Link href="/returns" className="hover:text-white font-semibold">İade</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4 text-lg">Yasal</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li><Link href="/privacy" className="hover:text-white font-semibold">Gizlilik</Link></li>
                <li><Link href="/terms" className="hover:text-white font-semibold">Şartlar</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4 text-lg">Bağlantı</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li><Link href="/newsletter" className="hover:text-white font-semibold">Bülten</Link></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t-2 border-white/30 text-center text-sm text-white font-bold`}>
            Playable © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
      {/* Left-side ad carousel (Casper concept) - hide on admin routes */}
      {!router.pathname.startsWith('/admin') && <AdCarousel />}
    </div>
  );
}
