import { Router } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hash });
  await user.save();
  res.json({ id: user._id, email: user.email });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for:', email);
  const user = await User.findOne({ email });
  if (!user) {
    console.log('Login failed: user not found', email);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    console.log('Login failed: incorrect password for', email);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  console.log('Login successful for', email);
  res.json({ token });
});

export default router;
