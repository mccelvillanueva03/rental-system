import mongoose from "mongoose";

import {
  compareOTP,
  comparePassword,
} from "../middleware/compareUserBcrypt.js";
import hashUserData from "../middleware/hashUserData.js";
import { passwordChanged } from "../middleware/passwordChangedAt.js";

const userSchema = new mongoose.Schema(
  {
    //token
    refreshToken: { type: String, select: false },
    refreshTokenExpiresAt: { type: Date, select: false },

    //user details
    isAdmin: { type: Boolean, default: false },
    username: { type: String, trim: true, unique: true, sparse: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    passwordChangedAt: { type: Date },
    role: { type: [String], enum: ["tenant", "landlord"], default: ["tenant"] },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isEmailVerified: { type: Boolean, default: false },

    //User login with Google OAuth
    googleId: { type: String },
    isGoogleAccount: { type: Boolean, default: false },

    //otp
    otp: { type: String },
    otpExpiresAt: { type: Date },

    //reviews
    averageRating: { type: Number, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },

    reviewsGiven: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        default: [],
      },
    ],

    reviewsReceived: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", hashUserData);
userSchema.pre("save", passwordChanged);
userSchema.methods.comparePassword = comparePassword;
userSchema.methods.compareOTP = compareOTP;

const User = mongoose.model("User", userSchema);
export default User;
