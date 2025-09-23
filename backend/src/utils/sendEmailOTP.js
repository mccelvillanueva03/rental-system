import transporter from "../config/nodemailer.js";

export async function sendEmailOTP(user) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000); //generate random 6 digits

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Email Verification",
      html: `<h1>Verify Your Email</h1><p>Enter this OTP to your app for email verification.<br><strong>${otp}</strong></p>`,
    };

    const emailSent = await transporter.sendMail(mailOptions);
    //check if email sent
    if (!emailSent) throw new Error("Failed to send OTP");

    //if email sent successfully
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 600000;
    await user.save();

    return { otpExpiresAt: user.otpExpiresAt };
  } catch (error) {
    console.log("Error sending email", error);
    return res.status(500).json({ message: "Server error. Error sending OTP" });
  }
}
