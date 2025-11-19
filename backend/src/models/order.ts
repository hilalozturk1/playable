import { Schema, model, Types } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    lineTotal: Number,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subTotal: Number,
    taxTotal: Number,
    shippingFee: Number,
    grandTotal: Number,
    shippingAddress: {
      fullName: String,
      city: String,
      address: String,
      phone: String,
      notes: String,
    },
    status: {
      type: String,
      enum: ['Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal'],
      default: 'Hazırlanıyor',
    },
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

export default model('Order', orderSchema);
