import express from "express";
import viewProfile from "../controllers/users/viewProfile.js";
import uploadProfile from "../controllers/users/uploadProfile.js";
import { authorizeRole, verifyToken } from "../middleware/verifyAccessToken.js";
import { parser } from "../middleware/multer.js";

const router = express.Router();

router.get("/:id", viewProfile);
router.post(
  "/upload-profile-image",
  verifyToken,
  authorizeRole("tenant", "host", "admin"),
  (req, res, next) => {
    parser.single("profileImage")(req, res, function (err) {
      if (err) {
        // Multer error
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadProfile
);

export default router;
