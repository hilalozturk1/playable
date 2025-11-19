import { Schema, model } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Category = model('Category', CategorySchema);
