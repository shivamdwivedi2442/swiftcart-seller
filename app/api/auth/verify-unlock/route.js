import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const user = await User.findOne({ email, role: "seller" });
    if (!user) return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });

    if (String(user.otp) !== String(otp) || new Date() > user.otpExpiry) {
      return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 400 });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Account unlocked! You can login now." });
  } catch (error) {
    console.error("Verify Unlock Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}