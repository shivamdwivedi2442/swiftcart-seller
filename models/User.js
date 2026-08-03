import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "seller" },
  isVerified: { type: Boolean, default: false }, // OTP verify hui ya nahi
  accountStatus: { type: String, enum: ["pending", "active", "banned"], default: "pending" },
  sellerCode: { type: String, default: null }, // admin approve karne par generate hoga
  otp: { type: String },
  otpExpiry: { type: Date },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, { timestamps: true, strict: false });

export default mongoose.models.User || mongoose.model("User", userSchema);