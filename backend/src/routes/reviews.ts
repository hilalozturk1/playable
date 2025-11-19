import { Router } from 'express';
import Review from '../models/review';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public: get reviews for a product
router.get('/:productId', async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
  res.json(reviews);
});

// Auth or guest: add review
router.post('/:productId', async (req, res) => {
  const { rating, comment, guestEmail, userId, userName } = req.body;
  if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ message: 'Puan 1-5 arası olmalı' });
  if (!comment) return res.status(400).json({ message: 'Yorum gerekli' });
  const review = await Review.create({
    productId: req.params.productId,
    userId: userId || undefined,
    userName: userName || (guestEmail ? guestEmail : 'Guest'),
    guestEmail: guestEmail || '',
    rating,
    comment,
  });
  res.json(review);
});

export default router;
