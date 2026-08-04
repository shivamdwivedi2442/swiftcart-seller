import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

function generateLoginCode() {
  return `DEL${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(req) {
  try {
    await connectDB();
    const { email, activationCode } = await req.json();

    console.log("Received:", email, activationCode); // ✅ Debug line

    const seller = await User.findOne({ email });

    console.log("Found Seller:", seller ? seller.email : "NOT FOUND"); // ✅ Debug line
    console.log("DB activation code:", seller ? seller.activationCode : "NOT FOUND");// ✅ Debug line

    if (!seller) {
      return NextResponse.json({ success: false, error: "Account not found." }, { status: 404 });
    }

    if (seller.sellercode) {
      return NextResponse.json({ success: false, error: "Account already activated. Please login." }, { status: 400 });
    }

    if (String(seller.activationCode) !== String(activationCode)) {
      return NextResponse.json({ success: false, error: "Invalid activation code." }, { status: 400 });
    }

    // ... baaki same

    if (new Date() > seller.activationCodeExpiry) {
      return NextResponse.json({ success: false, error: "Activation code expired. Contact admin." }, { status: 400 });
    }

    const loginCode = generateLoginCode();
    seller.sellercode = loginCode;
    seller.activationCode = undefined;
    seller.activationCodeExpiry = undefined;
    await seller.save();

    return NextResponse.json({ success: true, message: "Account activated!", loginCode });
  } catch (error) {
    console.error("Activation Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}