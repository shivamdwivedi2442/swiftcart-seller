import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    const partner = await User.findOne({ email });
    if (!partner) {
      return NextResponse.json({ success: false, error: "Invalid account." }, { status: 401 });
    }

    if (partner.lockUntil && partner.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((partner.lockUntil - new Date()) / 60000);
      return NextResponse.json({
        success: false,
        error: `Too many failed attempts. Try again in ${minutesLeft} minute(s), or verify via OTP to unlock now.`,
        locked: true,
      }, { status: 429 });
    }

    if (!partner.isVerified) {
      return NextResponse.json({ success: false, error: "Please verify your email first." }, { status: 401 });
    }

    if (partner.accountStatus === "pending") {
      return NextResponse.json({ success: false, error: "Your account is awaiting admin approval." }, { status: 403 });
    }

    if (partner.accountStatus === "banned") {
      return NextResponse.json({ success: false, error: "Your account has been suspended. Contact admin." }, { status: 403 });
    }

    if (!partner.sellerCode) {
      return NextResponse.json({ success: false, error: "Please activate your account first." }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      partner.failedLoginAttempts += 1;
      if (partner.failedLoginAttempts >= MAX_ATTEMPTS) {
        partner.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      await partner.save();

      const attemptsLeft = MAX_ATTEMPTS - partner.failedLoginAttempts;
      return NextResponse.json({
        success: false,
        error: attemptsLeft > 0
          ? `Invalid password. ${attemptsLeft} attempt(s) left before lockout.`
          : "Too many failed attempts. Account locked for 15 minutes.",
      }, { status: 401 });
    }

    partner.failedLoginAttempts = 0;
    partner.lockUntil = null;
    await partner.save();

    const token = jwt.sign({ partnerId: partner._id, name: partner.name }, process.env.JWT_SECRET, { expiresIn: "30d" });

    const response = NextResponse.json({ success: true, message: `Welcome, ${partner.name}!` });
    response.cookies.set("seller_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}