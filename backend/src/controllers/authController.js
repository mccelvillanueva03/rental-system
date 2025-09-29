import validator from "validator";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import { signToken } from "../utils/signToken.js";
import { sendEmailOTP } from "../utils/sendEmailOTP.js";

//Display all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller:".error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//user login
export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    //check if user existing
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    //checks if user is verified
    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Email is not verified." });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ token, user: userSafe });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

//signup
export async function signup(req, res) {
  try {
    //check for empty fields
    let { email, password, fullName } = req.body || {};
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required!." });
    }
    const isEmail = validator.isEmail(email);
    //check if email is correct format
    if (!isEmail)
      return res.status(401).json({ message: "Invalid email address." });

    email = String(email).trim().toLowerCase();
    fullName = String(fullName).trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    const newUser = new User({ email, password, fullName });

    //send OTP to user email
    const result = sendEmailOTP(newUser);
    return res
      .status(200)
      .json({ message: "OTP send successfully", ...result });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error." });
  }
}

//verify the email
export async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required!." });
    }
    const pendingUser = await User.findOne({ email });

    //checks if email exist
    if (!pendingUser)
      return res.status(404).json({
        message: "Email Not Found!.",
      });

    //check if the user email is already verified
    if (pendingUser.isEmailVerified)
      return res
        .status(409)
        .json({ message: "Email is already verified. Proceed to login." });
    //compare otp to hashed otp
    const isOTPMatch = await pendingUser.compareOTP(otp);
    //check if otp matched
    if (!isOTPMatch) return res.status(401).json({ message: "Invalid OTP." });

    //check if otp is expired
    if (pendingUser.otpExpiresAt <= Date.now()) {
      pendingUser.otp = undefined;
      pendingUser.otpExpiresAt = undefined;
      await pendingUser.save();
      return res
        .status(410)
        .json({ message: "OTP expired. Please request again." });
    }
    //otp matched, otp !expired
    pendingUser.isEmailVerified = true;
    pendingUser.otp = undefined;
    pendingUser.otpExpiresAt = undefined;

    await pendingUser.save();

    const token = signToken(pendingUser);
    const userSafe = pendingUser.toObject();
    delete userSafe.password;

    return res.status(201).json({ token, user: userSafe });
  } catch (error) {
    console.log("Error in verifying email", error);
    res.status(500).json({ message: "Server Error." });
  }
}

//resending otp
export async function resendOTP(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required!." });

    const user = await User.findOne({ email }).select("+password");
    //check if user exist
    if (!user)
      return res.status(404).json({
        message: "Email Not Found!.",
      });
    //check if user is already verified
    if (user.isEmailVerified)
      return res
        .status(401)
        .json({ message: "Already verified. Proceed to login." });

    const isPasswordMatch = await user.comparePassword(password); //middleware: UserSchema method
    //check if password is match to email
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials!." });

    //resend email
    const result = sendEmailOTP(user);
    return res
      .status(200)
      .json({ message: "OTP send successfully", ...result });
  } catch (error) {
    console.log("Error in Resending OTP", error);
    res.status(500).json({ message: "Server Error." });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body || {};
    if (!email)
      return res.status(400).json({ message: "All fields are required!." });

    const user = await User.findOne({ email });

    //check if user exist
    if (!user) return res.status(404).json({ message: "Email Not Found." });

    //check if email is verified
    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Email is not verified!" });

    const result = sendEmailOTP(user);
    return res
      .status(200)
      .json({ message: "OTP send successfully.", ...result });
  } catch (error) {
    console.log("Error in Forgot Password.", error);
    res.status(500).json({ message: "Server Error." });
  }
}

export async function verifyForgotPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body || {};
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields required." });

    const user = await User.findOne({ email }).select("+password");
    //check if email exist
    if (!user) return res.status(404).json({ message: "Email Not Found." });

    const isOtpMatch = await user.compareOTP(otp);
    //check if otp is matched
    if (!isOtpMatch) return res.status(401).json({ message: "Invalid OTP." });
    //check otp if expired
    if (user.otpExpiresAt <= Date.now())
      return res
        .status(410)
        .json({ message: "OTP expired. Please request again." });

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = signToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ token, user: userSafe });
  } catch (error) {
    console.log("Error in verifying Forgot Password.", error);
    return res.status(500).json({ message: "Server Error." });
  }
}

export async function changePassword(req, res) {
  try {
    const { email, oldPassword, newPassword } = req.body || {};
    if (!email || !oldPassword || !newPassword)
      return res.status(400).json({ message: "All fields are required!." });

    const user = await User.findOne({ email }).select("+password");
    //check if user existing
    if (!user) return res.status(404).json({ message: "Email Not Found." });
    //check if email is verified
    if (!user.isEmailVerified)
      return res.status(401).json({ message: "Email is not verified!" });
    //check if oldPassword match to stored password

    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid Credentials" });

    if (oldPassword === newPassword)
      return res.status(400).json({ message: "Password still the same" });

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    const token = signToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ token, user: userSafe });
  } catch (error) {
    console.log("Error in Changing Password.", error);
    res.status(500).json({ message: "Server Error." });
  }
}

export async function googleLogin(req, res) {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { token } = req.body || {};

    if (!token)
      return res.status(400).json({ message: "Google Token is required." });

    //Verify the token with Google API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    //extract user info from verified token
    const { email, given_name, family_name, sub } = ticket.getPayload();

    const first = (given_name || "").trim();
    const last = (family_name || "").trim();
    const fullName = [first, last].filter(Boolean).join(" ");

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        user.isGoogleAccount = true;
        await user.save();
      }
    } else {
      user = new User({
        email,
        fullName: fullName,
        googleId: sub,
        isGoogleAccount: true,
        isEmailVerified: true,
        //generate a random password they wont use
        //required field in schema but wont be used in login.
        password: Math.random().toString(36).slice(-8), //generate a random password
      });
      await user.save();
    }
    const jwtToken = signToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ token: jwtToken, user: userSafe });
  } catch (error) {
    console.log("Error in Google Login.", error);
    res.status(500).json({ message: "Server Error." });
  }
}
