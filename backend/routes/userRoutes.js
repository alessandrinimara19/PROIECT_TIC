import express from "express";
import {
  getAllUsers,
  getUserDetails,
  // getUserArticles
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers) // Toti userii
router.get("/:userId", getUserDetails); // Profil utilizator
// router.get("/:userId/articles", getUserArticles); // Articole utilizator

export { router as userRouter };