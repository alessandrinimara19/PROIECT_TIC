import express from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  addCommentToArticle,
  deleteCommentFromArticle,
  likeArticle,
  dislikeArticle
} from "../controllers/articleController.js";

import { protectRoutes } from "../controllers/authController.js";

const router = express.Router();

// Rute
router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);
router.post("/:id/comments", addCommentToArticle);
router.delete("/:id/comments/:commentId", deleteCommentFromArticle);
router.post("/:id/like", likeArticle);
router.post("/:id/dislike", dislikeArticle)

router.use(protectRoutes);

export { router as articleRouter };
