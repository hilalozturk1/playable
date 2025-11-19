import { Router } from 'express';
import { Product } from '../models/product';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.use(authMiddleware, adminOnly);

// Create product
router.post('/', async (req, res) => {
  const data = req.body || {};
  // basic server-side validation
  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) return res.status(400).json({ message: 'Name is required' });
  if (data.price == null || typeof data.price !== 'number' || !(data.price > 0)) return res.status(400).json({ message: 'Price must be a number > 0' });
  if (!Array.isArray(data.images) || data.images.length === 0) return res.status(400).json({ message: 'At least one image is required' });
  const p = new Product(data);
  await p.save();
  res.json(p);
});

// Update product
router.put('/:id', async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
});

// Delete product
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Bulk toggle active via stock (example)
router.post('/bulk/toggle-stock', async (req, res) => {
  const { ids, stock } = req.body; // ids: string[], stock: number
  await Product.updateMany({ _id: { $in: ids } }, { $set: { stock } });
  res.json({ success: true });
});

export default router;
