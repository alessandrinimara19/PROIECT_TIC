import express from "express";
import {
  getUserProfile,
  getUserArticles
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/:userId", getUserProfile); // Profil utilizator
router.get("/:userId/articles", getUserArticles); // Articole utilizator

export { router as profileRouter };