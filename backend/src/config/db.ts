import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

export const connectDB = async () => {
  if (!MONGO_URI) throw new Error('MONGO_URI not set');
  // In development, optionally log which URI we're connecting to to help debug multiple DBs
  if (process.env.DEBUG === 'true') {
    console.log('DEBUG: connecting to MongoDB at', MONGO_URI);
  }
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};
