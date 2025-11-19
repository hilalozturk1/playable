import { Router } from 'express';
import { Product } from '../models/product';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const q = req.query.q as string | undefined;
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '12');
    const category = req.query.category as string | undefined;
    const min = parseFloat((req.query.min as string) || '0');
    const max = parseFloat((req.query.max as string) || '0');
    const sort = (req.query.sort as string) || '-createdAt';
    const filter: any = { stock: { $gt: 0 } };
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (min) filter.price = { ...(filter.price || {}), $gte: min };
    if (max) filter.price = { ...(filter.price || {}), $lte: max };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort as any);
    res.json({ total, page, products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

export default router;
