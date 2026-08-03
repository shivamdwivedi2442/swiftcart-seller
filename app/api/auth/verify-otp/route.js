import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });

    if (String(user.otp) !== String(otp)) {
      return NextResponse.json({ success: false, error: "Invalid OTP!" }, { status: 400 });
    }
    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ success: false, error: "OTP has expired!" }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Email verified! Waiting for admin approval." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}