import { Router } from 'express';
import { Product } from '../models/product';
import Review from '../models/review';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../models/user';

const router = Router();

const SORT_MAP: Record<string, any> = {
  'price_asc': { price: 1 },
  'price_desc': { price: -1 },
  'rating_desc': { rating: -1, ratingCount: -1 },
  'newest': { createdAt: -1 },
  'popular': { ordersCount: -1 },
};

router.get('/', async (req, res) => {
  try {
    const q = req.query.q as string | undefined;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '12', 10);
    const category = req.query.category as string | undefined;
    const minPrice = parseFloat((req.query.min as string) || (req.query.minPrice as string) || '0');
    const maxPrice = parseFloat((req.query.max as string) || (req.query.maxPrice as string) || '0');
    const minRating = parseFloat((req.query.rating as string) || (req.query.minRating as string) || '0');
    const sortParam = (req.query.sort as string) || 'newest';
    const sort = SORT_MAP[sortParam] || SORT_MAP.newest;

    const filter: any = { stock: { $gt: 0 }, isActive: true };
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: minPrice };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: maxPrice };
    if (minRating) filter.rating = { $gte: minRating };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);

    res.json({ total, page, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

router.get('/:id/reviews', async (req, res) => {
  const reviews = await Review.find({ productId: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
});

router.post('/:id/reviews', authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { rating, comment } = req.body || {};
  const numericRating = Number(rating);
  if (!(numericRating >= 1 && numericRating <= 5)) {
    return res.status(400).json({ message: 'Puan 1 ile 5 arasında olmalıdır' });
  }
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
  const user = await User.findById(userId);
  const review = await Review.create({
    productId: product._id,
    userId,
    userName: user?.name || user?.email || 'Müşteri',
    rating: numericRating,
    comment: comment?.toString().slice(0, 2000) || '',
  });

  const stats = await Review.aggregate([
    { $match: { productId: product._id } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats[0]?.avgRating || 0;
  const count = stats[0]?.count || 0;
  product.rating = Math.round(avgRating * 10) / 10;
  product.ratingCount = count;
  await product.save();

  res.json(review);
});

export default router;
