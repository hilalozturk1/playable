import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';

import products from './routes/products';
import auth from './routes/auth';
import adminProducts from './routes/adminProducts';
import orders from './routes/orders';
import debug from './routes/debug';
import categories from './routes/categories';
import reviews from './routes/reviews';
import adminDashboard from './routes/adminDashboard';

import Order from './models/order';

dotenv.config();
const app = express();
app.use(cors());
// increase JSON body size to allow base64 image uploads from admin UI (development only)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/api/products', products);
app.use('/api/auth', auth);
app.use('/api/admin/products', adminProducts);
app.use('/api/orders', orders);
app.use('/api/debug', debug);
app.use('/api/categories', categories);
app.use('/api/reviews', reviews);
app.use('/api/admin/dashboard', adminDashboard);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => {
  console.error('Failed to connect DB', err);
});

// Demo mode: simulate order status progression for visual testing
if (process.env.DEMO_MODE === 'true') {
  console.log('DEMO_MODE enabled: starting order status simulator');
  setInterval(async () => {
    try {
      // move a few orders forward in status (Hazırlanıyor -> Kargoya Verildi -> Teslim Edildi)
      const toProcess = await Order.find({ status: { $in: ['Hazırlanıyor','Kargoya Verildi'] } }).limit(5);
      for (const o of toProcess) {
        if (o.status === 'Hazırlanıyor') o.status = 'Kargoya Verildi';
        else if (o.status === 'Kargoya Verildi') o.status = 'Teslim Edildi';
        await o.save();
      }
    } catch (err) {
      // ignore
    }
  }, 15 * 1000); // every 15s
}
