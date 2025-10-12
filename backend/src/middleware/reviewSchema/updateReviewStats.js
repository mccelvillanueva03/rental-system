import mongoose from "mongoose";
import User from "../../models/User.js";

const updateRevieweeStats = async function (review) {
  const revieweeId = review.reviewee;

  try {
    const result = await mongoose.model("Review").aggregate([
      { $match: { reviewee: new mongoose.Types.ObjectId(revieweeId) } },
      {
        $group: {
          _id: "$reviewee",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      const { averageRating, totalReviews } = result[0];

      await User.findByIdAndUpdate(revieweeId, {
        averageRating,
        totalReviews,
      });
    }
  } catch (error) {
    1;
    console.error("Error updating reviewee stats:", error);
  }
};
export default updateRevieweeStats;
