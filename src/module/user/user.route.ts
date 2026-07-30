import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router()

router.put("/my-profile", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER), userController.updateMyProfile);
router.delete("/delete", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER), userController.deleteMyProfile)



export const userRoutes = router