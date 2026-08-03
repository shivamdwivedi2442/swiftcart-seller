import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTPEmail(email, otp) {
  await transporter.sendMail({
    from: `"SwiftCart Seller" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Seller Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #4f46e5;">Verify Your Email</h2>
        <p>Your OTP code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e293b; background: #f8fafc; padding: 16px; text-align: center; border-radius: 12px;">
          ${otp}
        </div>
        <p style="color: #64748b; margin-top: 16px;">This code will expire in 10 minutes.</p>
      </div>
    `,
  });
}

export async function sendApprovalEmail(email, name, code) {
  await transporter.sendMail({
    from: `"SwiftCart Seller" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Seller Account is Approved! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #16a34a;">Congratulations, ${name}! 🎉</h2>
        <p>Your seller account has been approved by the admin. You can now log in and start listing products.</p>
        <p>Your unique login code is:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1e293b; background: #f8fafc; padding: 16px; text-align: center; border-radius: 12px;">
          ${code}
        </div>
        <p style="color: #64748b; margin-top: 16px;">Keep this code safe — you'll need it every time you log in along with your email and password.</p>
      </div>
    `,
  });
}