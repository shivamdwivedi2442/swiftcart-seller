import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing) {
      existing.name = name;
      existing.password = hashedPassword;
      existing.phone = phone;
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
    } else {
      await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: "seller",
        accountStatus: "pending",
        isVerified: false,
        otp,
        otpExpiry,
      });
    }

    await sendOTPEmail(email, otp);

    return NextResponse.json({ success: true, message: "OTP sent to your email!", email }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}