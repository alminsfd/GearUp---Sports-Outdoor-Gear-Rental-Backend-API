import { Router } from "express";
import { authController } from "./auth.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";


const router = Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get("/me", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER), authController.getMyProfile);
router.post("/refresh-token", authController.refreshToken)

export const authRouter = router;