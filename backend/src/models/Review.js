import mongoose from "mongoose";
import updateRevieweeStats from "../middleware/reviewSchema/updateReviewStats.js";

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

reviewSchema.post("save", async function () {
  await updateRevieweeStats(this);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
