import { Schema, model } from 'mongoose';
import { isAbsolute } from 'path';

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export const Category = model('Category', CategorySchema);
