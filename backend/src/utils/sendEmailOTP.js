import transporter from "../config/nodemailer.js";

export async function sendEmailOTP(user, otp) {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: user.email,
      subject: "Email Verification",
      html: `<h1>Verify Your Email</h1><p>Enter this OTP to your app for email verification.<br><strong>${otp}</strong></p>`,
    };

    const emailSent = await transporter.sendMail(mailOptions);
    //check if email sent
    if (!emailSent) throw new Error("Failed to send OTP");

    return;
  } catch (error) {
    console.log("Error sending email", error);
    return res.status(500).json({ message: "Server error. Error sending OTP" });
  }
}
