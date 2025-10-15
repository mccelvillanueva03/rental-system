import validator from "validator";

import User from "../../models/User.js";
import { sendEmailOTP } from "../../utils/sendEmailOTP.js";
import { capitalizedFirstLetter } from "../../utils/capitalizedFirstLetter.js";
import { signOtpToken } from "../../utils/signOtpToken.js";

async function signup(req, res) {
  try {
    //check for empty fields
    let { email, password, firstName, lastName } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required!." });
    }
    const isEmail = validator.isEmail(email);
    //check if email is correct format
    if (!isEmail)
      return res.status(401).json({ message: "Invalid email address." });

    email = String(email).trim().toLowerCase();
    firstName = String(firstName).trim();
    lastName = String(lastName).trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    capitalizedFirstLetter(firstName);
    capitalizedFirstLetter(lastName);

    let username;
    do {
      username = `user${Math.floor(1000 + Math.random() * 9000)}`;
    } while (await User.findOne({ username }));

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      username,
    });
    await newUser.save();

    const purpose = "verify_signup_email";

    const { otpToken, otp } = signOtpToken(newUser, purpose);

    //send OTP to user email
    const result = sendEmailOTP(newUser, otp);
    return res
      .status(200)
      .json({ message: "OTP send successfully", otpToken, ...result });
  } catch (error) {
    if (error?.code === 409) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}
export default signup;
