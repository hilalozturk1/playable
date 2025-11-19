import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer','admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

export const User = model('User', UserSchema);
