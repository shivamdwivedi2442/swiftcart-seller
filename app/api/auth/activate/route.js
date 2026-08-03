import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

function generateLoginCode() {
  return `SELL${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(req) {
  try {
    await connectDB();
    const { email, activationCode } = await req.json();

    const user = await User.findOne({ email, role: "seller" });
    if (!user) return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });

    if (user.sellerCode) {
      return NextResponse.json({ success: false, error: "Account already activated. Please login." }, { status: 400 });
    }

    if (String(user.activationCode) !== String(activationCode)) {
      return NextResponse.json({ success: false, error: "Invalid activation code." }, { status: 400 });
    }

    if (new Date() > user.activationCodeExpiry) {
      return NextResponse.json({ success: false, error: "Activation code expired. Contact admin." }, { status: 400 });
    }

    // ✅ Ab permanent login code banao, activation code hamesha ke liye clear kar do (one-time use)
    const loginCode = generateLoginCode();
    user.sellerCode = loginCode;
    user.activationCode = undefined;
    user.activationCodeExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Account activated!", loginCode });
  } catch (error) {
    console.error("Activation Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}