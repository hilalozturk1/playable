import { Schema, model, Types } from 'mongoose';

const reviewSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    userName: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

export default model('Review', reviewSchema);

