import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import api from '../../lib/api';
// chart.js auto registers scales/elements/plugins when imported
import 'chart.js/auto';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.replace('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, ordersRes, productsRes, customersRes] = await Promise.all([
        api.get('/admin/dashboard/stats', { headers }),
        api.get('/admin/dashboard/recent-orders', { headers }),
        api.get('/admin/dashboard/popular-products', { headers }),
        api.get('/admin/dashboard/customers', { headers })
      ]);

      const anyUnauthorized = [statsRes, ordersRes, productsRes, customersRes].some(r => r.status === 401);
      if (anyUnauthorized) {
        router.replace('/login');
        return;
      }

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setPopularProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (err: any) {
      console.error('Dashboard fetch error', err);
      if (err?.response) {
        if (err.response.status === 401) return router.replace('/login');
        const data = err.response.data;
        if (typeof data === 'string' && data.trim().startsWith('<')) {
          setError('Unexpected HTML response from server (likely a missing proxy).');
        } else if (typeof data === 'string') setError(data);
        else setError(err.message || 'Server error');
      } else {
        setError(err?.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const simulate = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return router.replace('/login');
      const res = await api.post('/admin/dashboard/simulate', {}, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) return router.replace('/login');
      if (res.status >= 400) {
        setError('Simulate failed');
        return;
      }
      await fetchData();
    } catch (err: any) {
      console.error('Simulate error', err);
      if (err?.response && typeof err.response.data === 'string' && err.response.data.trim().startsWith('<')) {
        setError('Unexpected HTML response from server (likely a missing proxy).');
      } else {
        setError(err?.message || 'Simulate failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        <div className="flex gap-3 items-center">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-800 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11a1 1 0 010-1.414l3.707-3.707a1 1 0 011.414 1.414L6.414 10l1.293 1.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
            Geri
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/admin/products')} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">Ürünler</button>
            <button onClick={() => router.push('/admin/categories')} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm">Kategoriler</button>
            <button onClick={() => router.push('/admin/customers')} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm">Müşteriler</button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => fetchData()} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm">Yenile</button>
            <button onClick={() => simulate()} className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm">Simulate</button>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <div>Loading...</div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">Hata: {error}</div>
        )}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded shadow p-4">
              <div className="text-gray-500 text-xs">Toplam Satış</div>
              <div className="text-2xl font-bold">₺{stats.totalSales?.toLocaleString('tr-TR') || 0}</div>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="text-gray-500 text-xs">Sipariş Sayısı</div>
              <div className="text-2xl font-bold">{stats.orderCount || 0}</div>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="text-gray-500 text-xs">Müşteri Sayısı</div>
              <div className="text-2xl font-bold">{stats.customerCount || 0}</div>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="text-gray-500 text-xs">Aktif Ürün</div>
              <div className="text-2xl font-bold">{stats.activeProductCount || 0}</div>
            </div>
          </div>
        )}
        {/* Satış trendi grafiği */}
        {!loading && stats && stats.salesByDay && (
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Satış Trendi</div>
            <Bar
              data={{
                labels: stats.salesByDay.map((d: any) => d.date),
                datasets: [{
                  label: 'Satış',
                  data: stats.salesByDay.map((d: any) => d.total),
                  backgroundColor: 'rgba(59,130,246,0.5)'
                }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        )}
        {/* Son siparişler */}
        {!loading && recentOrders.length > 0 && (
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Son Siparişler</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th>ID</th><th>Müşteri</th><th>Tutar</th><th>Durum</th><th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr key={o._id} className="border-b last:border-0">
                    <td>{o._id.slice(-6)}</td>
                    <td>{o.userId || o.guestEmail || 'Guest'}</td>
                    <td>₺{o.grandTotal?.toLocaleString('tr-TR') || 0}</td>
                    <td>{o.status}</td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleString('tr-TR') : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Popüler ürünler */}
        {!loading && popularProducts.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Popüler Ürünler</div>
            <ul>
              {popularProducts.map((p: any) => (
                <li key={p._id} className="flex justify-between border-b last:border-0 py-1">
                  <span>{p.name}</span>
                  <span className="text-gray-500">{p.ordersCount || 0} satış</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (!loading && (
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Popüler Ürünler</div>
            <div className="text-sm text-gray-500">Henüz popüler ürün yok.</div>
          </div>
        ))}
        {/* Müşteri listesi */}
        {!loading && customers.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Müşteriler</div>
            <ul>
              {customers.map((c: any) => (
                <li key={c._id} className="flex justify-between border-b last:border-0 py-1 items-center">
                  <button onClick={() => router.push(`/admin/customers/${c._id}`)} className="text-left flex-1">
                    <div className="font-medium">{c.name || c.email}</div>
                    <div className="text-sm text-gray-500">{c.email}</div>
                  </button>
                  <div className="ml-4 text-gray-500">{c.orderCount || 0} sipariş</div>
                </li>
              ))}
            </ul>
          </div>
        ) : (!loading && (
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Müşteriler</div>
            <div className="text-sm text-gray-500">Henüz kayıtlı müşteri yok.</div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
