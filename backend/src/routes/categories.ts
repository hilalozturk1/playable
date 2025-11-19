import { Router } from 'express';
import { Category } from '../models/category';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

// Public: list categories
router.get('/', async (req, res) => {
  const cats = await Category.find({ isActive: true });
  res.json(cats);
});

// Admin: create category
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const cat = new Category({ name, description });
  await cat.save();
  res.json(cat);
});

// Admin: update category
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cat) return res.status(404).json({ message: 'Not found' });
  res.json(cat);
});

// Admin: delete category
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
