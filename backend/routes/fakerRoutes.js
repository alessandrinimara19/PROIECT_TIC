import express from "express"
import { createFakeUsers, createFakeArticles } from "../controllers/fakerController.js"

const router = express.Router();

router.post("/users", createFakeUsers)
router.post("/articles", createFakeArticles)

export { router as fakerRouter };
