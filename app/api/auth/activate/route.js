import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

function generateLoginCode() {
  return `SELL${crypto.randomBytes(3).toString("hex").toUpperCase()}`; // ✅ SELL bhi kar diya, DEL galat tha Seller App ke liye
}

export async function POST(req) {
  try {
    await connectDB();
    const { email, activationCode } = await req.json();

    const seller = await User.findOne({ email, role: "seller" });

    if (!seller) {
      return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });
    }

    if (seller.sellerCode) { // ✅ Fix: capital C
      return NextResponse.json({ success: false, error: "Account already activated. Please login." }, { status: 400 });
    }

    if (String(seller.activationCode) !== String(activationCode)) {
      return NextResponse.json({ success: false, error: "Invalid activation code." }, { status: 400 });
    }

    if (new Date() > seller.activationCodeExpiry) {
      return NextResponse.json({ success: false, error: "Activation code expired. Contact admin." }, { status: 400 });
    }

    const loginCode = generateLoginCode();
    seller.sellerCode = loginCode;
    seller.activationCode = undefined;
    seller.activationCodeExpiry = undefined;
    await seller.save();

    return NextResponse.json({ success: true, message: "Account activated!", loginCode });
  } catch (error) {
    console.error("Activation Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}