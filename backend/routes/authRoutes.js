import express from "express"
import { 
    login, 
    register,
    protectRoutes
} from "./../controllers/authController.js"

const router = express.Router()

router.post("/register", register);
router.post("/login", login);

router.use(protectRoutes);

export { router as authRouter };