import { Router } from 'express';
import { User } from '../models/user';
import { Product } from '../models/product';
import bcrypt from 'bcryptjs';

const router = Router();

// Development-only: list users when DEBUG=true
router.get('/users', async (req, res) => {
  if (process.env.DEBUG !== 'true') return res.status(403).json({ message: 'Disabled' });
  const users = await User.find({}, { password: 0 }).lean();
  res.json(users);
});

// Development-only: run seed (creates sample products and users)
router.post('/seed', async (req, res) => {
  if (process.env.DEBUG !== 'true') return res.status(403).json({ message: 'Disabled' });
  try {
    await Product.deleteMany({});
    await User.deleteMany({});
    const products = [
      { name: 'Blue T-Shirt', description: 'Comfortable cotton tee', price: 19.99, images: [], category: 'Clothing', rating: 4.2, stock: 10 },
      { name: 'Running Shoes', description: 'Lightweight running shoes', price: 79.99, images: [], category: 'Shoes', rating: 4.7, stock: 5 },
      { name: 'Wireless Headphones', description: 'Noise-cancelling', price: 129.99, images: [], category: 'Electronics', rating: 4.5, stock: 3 }
    ];
    await Product.insertMany(products);
    const hash = await bcrypt.hash('Password123', 10);
    await User.create({ name: 'Admin', email: 'admin@example.com', password: hash, role: 'admin' });
    await User.create({ name: 'User', email: 'user@example.com', password: hash, role: 'customer' });
    res.json({ message: 'Seed complete' });
  } catch (err: any) {
    console.error('Seed failed', err);
    res.status(500).json({ message: 'Seed failed', error: err.message || err });
  }
});

export default router;
