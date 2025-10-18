import express from "express";
import { createReview } from "../controllers/reviewController/createReview.js";
import { authorizeRole, verifyAccessToken } from "../middleware/verifyAccessToken.js";

const router = express.Router();

router.post("/addReview", verifyAccessToken, authorizeRole("tenant","landlord"), createReview);

export default router;