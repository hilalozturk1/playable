import { Schema, model } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    category: { type: String },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Product = model('Product', ProductSchema);
