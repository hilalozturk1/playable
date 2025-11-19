import { Router } from 'express';
import Order from '../models/order';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Create order (private)
router.post('/', authMiddleware, async (req: any, res) => {
  const userId = req.user.sub;
  const { items, shippingAddress, total } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must include at least one item' });
  }

  // Normalize incoming items: accept { id, name, price, qty } or { productId, name, price, quantity }
  const normalized = items.map((it: any) => {
    const productId = it.productId || it.id;
    const quantity = it.quantity || it.qty || it.q || 1;
    return { productId, name: it.name || '', quantity, price: it.price || 0 };
  });

  // Basic validation: ensure productId present
  for (const it of normalized) {
    if (!it.productId) return res.status(400).json({ message: 'Each order item must include productId (or id)' });
  }

  try {
    const order = await Order.create({ userId, items: normalized, shippingAddress, total });
    res.json(order);
  } catch (err: any) {
    console.error('Order create failed', err);
    res.status(500).json({ message: 'Failed to create order', error: err.message || err });
  }
});

// List orders for user
router.get('/my', authMiddleware, async (req: any, res) => {
  const userId = req.user.sub;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  res.json(orders);
});


router.post('/create', async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;

    // Dummy payment
    const paymentResult = {
      status: "success",
      transactionId: "TX-" + Math.random().toString(36).substring(2),
    };

    // Create order in DB
    const order = await Order.create({
      items,
      total,
      shippingAddress,
      payment: paymentResult,
      status: "Processing",
    });

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});
export default router;
