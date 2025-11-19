import { Router } from 'express';
import Order from '../models/order';
import { User } from '../models/user';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { adminOnly, authMiddleware } from '../middleware/auth';
import { cacheGet, cacheSet, cacheDel } from '../lib/cache';

const router = Router();

router.use(authMiddleware, adminOnly);

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDemoStats() {
  const days = 14;
  const salesByDay = [] as any[];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    salesByDay.push({ date: d.toISOString().slice(0, 10), total: randomInt(500, 5000) });
  }
  const totalSales = salesByDay.reduce((s, x) => s + x.total, 0);
  const orderCount = randomInt(20, 200);
  const customerCount = randomInt(10, 100);
  const activeProductCount = randomInt(30, 120);
  const popular = Array.from({ length: 6 }).map((_, i) => ({ _id: `p${i+1}`, name: `Demo Ürün ${i+1}`, ordersCount: randomInt(5,50) }));
  const recentOrders = Array.from({ length: 8 }).map((_, i) => ({
    _id: `o${Date.now().toString().slice(-6)}${i}`,
    userId: `u${randomInt(1,20)}`,
    guestEmail: null,
    grandTotal: randomInt(100, 2000),
    status: ['Hazırlanıyor','Kargoya Verildi','Teslim Edildi'][randomInt(0,2)],
    createdAt: new Date(Date.now() - randomInt(0, 5) * 86400000)
  }));
  const customers = Array.from({ length: 8 }).map((_, i) => ({ _id: `u${i+1}`, name: `Müşteri ${i+1}`, email: `customer${i+1}@example.com`, orderCount: randomInt(0,10) }));

  return { totalSales, orderCount, customerCount, salesByDay, popular, recentOrders, customers, activeProductCount };
}

// Toplam satış, sipariş, müşteri sayısı, satış trendi, sipariş durum dağılımı
router.get('/stats', async (req, res) => {
  try {
    const demo = process.env.DEMO_MODE === 'true';
    // try cache first (short TTL)
    try {
      const cached = await cacheGet('dashboard:stats');
      if (cached && !demo) {
        return res.json(JSON.parse(cached));
      }
    } catch (err) {
      // ignore cache errors
    }
    const [orderStats, customerCount, productStats] = await Promise.all([
      Order.aggregate([
        { $group: {
          _id: null,
          totalSales: { $sum: '$grandTotal' },
          orderCount: { $sum: 1 },
          salesByDay: { $push: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: '$grandTotal' } },
          statusCounts: { $push: '$status' }
        } }
      ]),
      User.countDocuments({ role: 'customer' }),
      Product.aggregate([
        { $group: { _id: null, totalStock: { $sum: '$stock' }, activeCount: { $sum: { $cond: ['$isActive', 1, 0] } } } }
      ])
    ]);

    const stats = orderStats[0] || {};

    // If demo mode or no orders in DB, return generated demo stats
    let out;
    if (demo || (!stats || (stats.orderCount || 0) === 0)) {
      const demoStats = generateDemoStats();
      out = {
        totalSales: demoStats.totalSales,
        orderCount: demoStats.orderCount,
        customerCount: demoStats.customerCount,
        salesByDay: demoStats.salesByDay,
        orderStatusCounts: [],
        totalStock: productStats[0]?.totalStock || 0,
        activeProductCount: demoStats.activeProductCount
      };
    } else {
      out = {
        totalSales: stats.totalSales || 0,
        orderCount: stats.orderCount || 0,
        customerCount,
        salesByDay: stats.salesByDay || [],
        orderStatusCounts: stats.statusCounts || [],
        totalStock: productStats[0]?.totalStock || 0,
        activeProductCount: productStats[0]?.activeCount || 0
      };
    }

    // set cache (best-effort)
    try {
      await cacheSet('dashboard:stats', out, 60); // 60s cache
    } catch (err) {}

    res.json(out);
  } catch (err) {
    console.error('Dashboard stats error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Son siparişler
router.get('/recent-orders', async (req, res) => {
  try {
    const demo = process.env.DEMO_MODE === 'true';
    // try cache
    try {
      const cached = await cacheGet('dashboard:recent-orders');
      if (cached && !demo) return res.json(JSON.parse(cached));
    } catch (e) {}

    const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
    if (demo || (orders.length === 0)) {
      const demoStats = generateDemoStats();
      // cache demo response as well for a short while
      try { await cacheSet('dashboard:recent-orders', demoStats.recentOrders, 60); } catch (e) {}
      return res.json(demoStats.recentOrders);
    }
    try { await cacheSet('dashboard:recent-orders', orders, 60); } catch (e) {}
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Popüler ürünler
router.get('/popular-products', async (req, res) => {
  try {
    const demo = process.env.DEMO_MODE === 'true';
    try {
      const cached = await cacheGet('dashboard:popular-products');
      if (cached && !demo) return res.json(JSON.parse(cached));
    } catch (e) {}

    const products = await Product.find().sort({ ordersCount: -1 }).limit(10);
    if (demo || products.length === 0) {
      const demoStats = generateDemoStats();
      try { await cacheSet('dashboard:popular-products', demoStats.popular, 60); } catch (e) {}
      return res.json(demoStats.popular);
    }
    try { await cacheSet('dashboard:popular-products', products, 60); } catch (e) {}
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stokta olmayan ürünler
router.get('/out-of-stock', async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lte: 0 } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Müşteri listesi
router.get('/customers', async (req, res) => {
  try {
    const demo = process.env.DEMO_MODE === 'true';
    const users = await User.find({ role: 'customer' });
    if (demo || users.length === 0) {
      const demoStats = generateDemoStats();
      return res.json(demoStats.customers);
    }
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Müşteri detay + sipariş geçmişi
router.get('/customers/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const orders = await Order.find({ userId: req.params.id });
    if ((!user || orders.length === 0) && process.env.DEMO_MODE === 'true') {
      const demoStats = generateDemoStats();
      const demoUser = demoStats.customers.find(c => c._id === req.params.id) || { _id: req.params.id, name: `Müşteri ${req.params.id}`, email: `guest${req.params.id}@example.com` };
      return res.json({ user: demoUser, orders: demoStats.recentOrders.filter((o: any) => o.userId === req.params.id) });
    }
    res.json({ user, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

 // Admin-only endpoint to trigger a delivery/order status simulation on demand
router.post('/simulate', async (req, res) => {
  try {
    // advance statuses (Hazırlanıyor -> Kargoya Verildi -> Teslim Edildi)
    const toProcess = await Order.find({ status: { $in: ['Hazırlanıyor','Kargoya Verildi'] } }).limit(20);
    for (const o of toProcess) {
      if (o.status === 'Hazırlanıyor') o.status = 'Kargoya Verildi';
      else if (o.status === 'Kargoya Verildi') o.status = 'Teslim Edildi';
      await o.save();
    }
    // invalidate stats and lists cache so admin UI sees fresh numbers
    try { await cacheDel('dashboard:stats'); await cacheDel('dashboard:popular-products'); await cacheDel('dashboard:recent-orders'); } catch (e) {}
    res.json({ updated: toProcess.length });
  } catch (err) {
    console.error('Simulate failed', err);
    res.status(500).json({ message: 'Simulation failed' });
  }
});
