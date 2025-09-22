import transporter from "../config/nodemailer.js";

export async function sendEmailOTP(user) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpires = Date.now() + 600000;

    await user.save();

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Email Verification",
      html: `<h1>Verify Your Email</h1><p>Enter this OTP to your app for email verification.<br><strong>${otp}</strong></p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email", error);
    return res.status(500).json({ message: "Server error. Error sending OTP" });
  }
}