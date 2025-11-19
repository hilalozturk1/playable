import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

export default function AdminCustomersList() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const r = await api.get('/admin/dashboard/customers', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setCustomers(r.data || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    }
    setLoading(false);
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Müşteriler</h1>
        </div>
        {loading ? (
          <div className="bg-white rounded shadow p-6 text-center">Yükleniyor...</div>
        ) : (
          <ul className="bg-white rounded shadow divide-y">
            {customers.map((c: any) => (
              <li key={c._id} className="flex justify-between items-center px-4 py-3">
                <button onClick={() => router.push(`/admin/customers/${c._id}`)} className="text-left flex-1 text-left" disabled={loading}>
                  <div className="font-semibold">{c.name || c.email}</div>
                  <div className="text-sm text-gray-500">{c.email}</div>
                </button>
                <div className="ml-4 text-gray-500">{c.orderCount || 0} sipariş</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
