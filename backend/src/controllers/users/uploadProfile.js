import User from "../../models/User.js";
import cloudinary from "../../config/cloudinaryConfig.js";

async function uploadProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const allowed_formats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    // Validate file format
    if (!allowed_formats.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Invalid file format" });
    }

    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    // Update user's profile image URL
    const imageUrl = req.file.path;
    const imageId = req.file.filename || req.file.public_id;
    user.profileImage = {
      url: imageUrl,
      public_id: imageId,
    };
    await user.save();

    console.log("File Info:", req.file);
    return res
      .status(200)
      .json({ message: "Profile image uploaded successfully", imageUrl });
  } catch (error) {
    console.log("Error in uploading profile", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export default uploadProfile;
