import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        _id: String,
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    total: Number,
    shippingAddress: {
      fullName: String,
      city: String,
      address: String,
    },
    payment: {
      status: String,
      transactionId: String,
    },
    status: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
