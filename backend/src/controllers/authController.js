import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { sendEmailOTP } from "../utils/sendEmailOTP.js";

//Display all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
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
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    //checks if user is verified
    if (!user.isEmailVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    if (!user) return res.status(401).json({ message: "Invalid credentials." });

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
    let { email, password, firstName, lastName } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required!." });
    }

    email = String(email).trim().toLowerCase();
    firstName = String(firstName).trim();
    lastName = String(lastName).trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    const newUser = new User({ email, password, firstName, lastName });
    await newUser.save();
    //send OTP to user email
    sendEmailOTP(newUser);

    res
      .status(200)
      .json({
        message:
          "OTP sent to your email. Please verify first before logging in.",
      });
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
    if (!pendingUser) {
      return res
        .status(404)
        .json({
          message:
            "Email Not Found!. Please Login or Signup first before proceeding.",
        });
    }
    //check if the user email is already verified
    if (pendingUser.isEmailVerified) return res.status(409).json({message: "Email is already verified. Proceed to login."})
    //compare otp to hashed otp
    const isOTPMatched = await pendingUser.compareOTP(otp);
    //check if otp matched
    if (!isOTPMatched) return res.status(401).json({ message: "Invalid OTP." });

    //check if otp is not expired
    if (pendingUser.otpExpires === Date.now()) {
      pendingUser.otp = null;
      pendingUser.otpExpires = null;
      await pendingUser.save();
      return res
        .status(410)
        .json({ message: "OTP expired. Please request again." });
    }
    //otp matched
    pendingUser.isEmailVerified = true;
    pendingUser.otp = null;
    pendingUser.otpExpires = null;
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

export async function resendOTP(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({message: "All fields are required!."})

    const user = User.findOne({email}).select("+password")
    

  } catch (error) {
    console.log("Error in Resending OTP", error)
    res.status(500).json({message: "Server Error."})
  }
}