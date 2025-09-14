import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // no duplicate emails
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false, // default not verified
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId, // reference to Property model
        ref: "Property",
      },
    ],
    likedProperty: [
      {
        type: mongoose.Schema.Types.ObjectId, // reference to Property model
        ref: "Property",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;