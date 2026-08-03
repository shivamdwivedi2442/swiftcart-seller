import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
  },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["COD", "Razorpay"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: {
    type: String,
    enum: ["Processing", "Packed", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Processing",
  },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner", default: null },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);