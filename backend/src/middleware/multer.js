import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req) => `LongStay/profile-images/${req.user.id}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export const parser = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed_formats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowed_formats.includes(file.mimetype)) {
      cb(new Error("Invalid file format")); // This error is caught by the wrapper in Step 2
    } else {
      cb(null, true);
    }
  },
});
