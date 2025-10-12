import express from "express";
import { createReview } from "../controllers/reviewController/createReview.js";
import { authorizeRole, verifyToken } from "../middleware/verifyJwt.js";

const router = express.Router();

router.post("/addReview", verifyToken, authorizeRole("tenant","landlord"), createReview);

export default router;