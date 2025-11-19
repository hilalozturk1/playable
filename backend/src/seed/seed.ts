import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import { Product } from '../models/product';
import { User } from '../models/user';
import bcrypt from 'bcryptjs';

dotenv.config();

// generate 20 dummy products with internet-hosted images (picsum.photos)
const products = Array.from({ length: 20 }).map((_, i) => {
  const id = i + 1;
  const categories = ['Clothing', 'Shoes', 'Electronics', 'Home', 'Accessories'];
  const category = categories[i % categories.length];
  const name = `${category} Product ${id}`;
  const price = parseFloat((Math.random() * 200 + 5).toFixed(2));
  const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0 - 5.0
  const stock = Math.floor(Math.random() * 20);
  // use picsum.photos seeded images so they are stable but internet-hosted
  const images = [
    `https://picsum.photos/seed/product-${id}-1/800/600`,
    `https://picsum.photos/seed/product-${id}-2/800/600`,
    `https://picsum.photos/seed/product-${id}-3/800/600`
  ];
  return {
    name,
    description: `${name} - A high quality ${category.toLowerCase()} item.`,
    price,
    images,
    category,
    rating,
    stock
  };
});

async function run() {
  await connectDB();
  await Product.deleteMany({});
  await User.deleteMany({});
  await Product.insertMany(products);
  const hash = await bcrypt.hash('Password123', 10);
  await User.create({ name: 'Admin', email: 'admin@example.com', password: hash, role: 'admin' });
  await User.create({ name: 'User', email: 'user@example.com', password: hash, role: 'customer' });
  console.log('Seed complete');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
