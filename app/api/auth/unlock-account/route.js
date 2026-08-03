import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/sendEmail";

// Step 1: OTP bhejo unlock karne ke liye
export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email, role: "seller" });
    if (!user) return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp);

    return NextResponse.json({ success: true, message: "OTP sent to unlock your account." });
  } catch (error) {
    console.error("Unlock Request Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}