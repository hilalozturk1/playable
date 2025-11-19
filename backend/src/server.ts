import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import products from './routes/products';
import auth from './routes/auth';
import adminProducts from './routes/adminProducts';
import orders from './routes/orders';
import debug from './routes/debug';

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

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => {
  console.error('Failed to connect DB', err);
});
