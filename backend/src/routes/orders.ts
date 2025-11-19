import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Order from '../models/order';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { cacheDel } from '../lib/cache';
import { Product } from '../models/product';

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const TAX_RATE = parseNumber(process.env.ORDER_TAX_RATE, 0.18);
const SHIPPING_FEE = parseNumber(process.env.ORDER_SHIPPING_FEE, 49);
const FREE_SHIPPING_LIMIT = parseNumber(process.env.ORDER_FREE_SHIPPING_MIN, 750);

const router = Router();

// Create order (private or guest)
router.post('/', async (req: any, res) => {
  // try to extract userId from Authorization header if present
  let userId: any = undefined;
  try {
    const auth = (req.headers && req.headers.authorization) || '';
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      userId = payload.sub;
    }
  } catch (e) {
    // ignore token errors, we'll allow guest checkout below
  }

  const { items = [], shippingAddress = {}, guestEmail } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Sipariş için en az bir ürün gerekli' });
  }

  // if no userId (guest), require guestEmail
  if (!userId && !guestEmail) {
    return res.status(400).json({ message: 'Giriş yapılmadıysa guestEmail gerekli' });
  }

  try {
    const normalized = items.map((it: any) => ({
      productId: it.productId || it.id || it._id,
      quantity: Math.max(1, parseInt(it.quantity || it.qty || it.q || '1', 10)),
    }));

    if (normalized.some(it => !it.productId)) {
      return res.status(400).json({ message: 'Her ürün için productId gereklidir' });
    }

    const productIds = normalized.map(it => it.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== normalized.length) {
      return res.status(400).json({ message: 'Bazı ürünler bulunamadı veya satışta değil' });
    }

    const orderItems = normalized.map(it => {
      const product = dbProducts.find(p => p._id.toString() === it.productId.toString());
      if (!product) throw new Error('Product not found');
      if (!product.isActive || product.stock <= 0) {
        throw new Error(`${product.name} stokta yok veya satışta değil`);
      }
      const quantity = Math.min(it.quantity, product.stock);
      if (quantity <= 0) {
        throw new Error(`${product.name} için stok yetersiz`);
      }
      const lineTotal = Number((product.price * quantity).toFixed(2));
      return {
        productId: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        quantity,
        lineTotal,
      };
    });

    const subTotal = Number(
      orderItems.reduce((sum, it) => sum + (it.lineTotal || 0), 0).toFixed(2)
    );
    const taxTotal = Number((subTotal * TAX_RATE).toFixed(2));
    const shippingFee =
      subTotal >= FREE_SHIPPING_LIMIT ? 0 : Number(SHIPPING_FEE.toFixed(2));
    const grandTotal = Number((subTotal + taxTotal + shippingFee).toFixed(2));
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const orderData: any = {
      items: orderItems,
      subTotal,
      taxTotal,
      shippingFee,
      grandTotal,
      shippingAddress,
      status: 'Hazırlanıyor',
      estimatedDelivery,
    };
    if (userId) orderData.userId = userId;
    else orderData.guestEmail = guestEmail;

    const order = await Order.create(orderData);

    // decrement stock, increment ordersCount and deactivate when stock reaches 0
    await Promise.all(
      orderItems.map(async item => {
        const updated = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity, ordersCount: item.quantity } },
          { new: true }
        );
        if (updated && updated.stock <= 0 && updated.isActive) {
          // mark inactive when stock depleted
          await Product.findByIdAndUpdate(updated._id, { isActive: false });
        }
      })
    );

    // invalidate dashboard caches (best-effort)
    try {
      await cacheDel('dashboard:stats');
      await cacheDel('dashboard:popular-products');
      await cacheDel('dashboard:recent-orders');
    } catch (e) {}

    res.json(order);
  } catch (err: any) {
    console.error('Order create failed', err);
    res
      .status(500)
      .json({ message: 'Sipariş oluşturulamadı', error: err.message || err });
  }
});

// List orders for user
router.get('/my', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ message: 'Missing user' });
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
