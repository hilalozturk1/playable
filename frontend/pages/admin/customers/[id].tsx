import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

export default function CustomerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [custRes, ordersRes] = await Promise.all([
        api.get(`/admin/dashboard/customers/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
        api.get(`/orders?userId=${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      ]);
      setCustomer(custRes.data);
      setOrders(ordersRes.data.orders || ordersRes.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  if (loading) return <div className="py-12 px-6">Yükleniyor...</div>;

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold">Müşteri</h2>
          <div className="mt-2"><strong>İsim:</strong> {customer.name || '-'}</div>
          <div><strong>Email:</strong> {customer.email || '-'}</div>
          <div><strong>Toplam Sipariş:</strong> {customer.orderCount || '-'}</div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-3">Siparişler</h3>
          {orders.length === 0 ? <div>Bu müşteriye ait sipariş yok.</div> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th>ID</th><th>Tutar</th><th>Durum</th><th>Tarih</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b last:border-0">
                    <td>{o._id.slice(-6)}</td>
                    <td>₺{o.grandTotal?.toLocaleString('tr-TR') || 0}</td>
                    <td>{o.status}</td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleString('tr-TR') : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
