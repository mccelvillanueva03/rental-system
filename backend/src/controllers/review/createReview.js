import Review from "../../models/Review.js";
import User from "../../models/User.js";

export async function createReview(req, res) {
  try {
    const { rating, reviewee, description } = req.body || {};
    const reviewer = req.user._id;

    // Check if all required fields are provided
    if (!rating || !reviewee || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the rating is within the valid range
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    // Check if the reviewee exists
    const revieweeUser = await User.findById(reviewee);
    if (!revieweeUser) {
      return res.status(404).json({ message: "Reviewee not found." });
    }

    // Prevent users from reviewing themselves
    if (reviewer.toString() === reviewee) {
      return res.status(400).json({ message: "You cannot review yourself." });
    }

    // Check if the reviewer has already reviewed the reviewee
    const existingReview = await Review.findOne({ reviewer, reviewee });
    if (existingReview) {
      return res
        .status(409)
        .json({ message: "You have already reviewed this user." });
    }
    // Create and save the new review
    const newReview = new Review({
      rating,
      reviewer,
      reviewee,
      description,
    });
    await newReview.save();

    //update the reviewer.reviewsGiven
    const currentReviewer = await User.findById(reviewer);
    currentReviewer.reviewsGiven.push(newReview._id);
    await currentReviewer.save();

    //update the reviewee.reviewsReceived
    revieweeUser.reviewsReceived.push(newReview._id);
    await revieweeUser.save();

    res
      .status(201)
      .json({ message: "Review created successfully.", newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error." });
  }
}
