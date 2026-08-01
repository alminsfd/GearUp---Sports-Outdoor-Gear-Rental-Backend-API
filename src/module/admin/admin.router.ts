import { Router } from "express";
import { auth } from "../../middleware/auth";
import { adminController } from "./admin.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

// All Admin Routes are protected with ADMIN role check
router.use(auth(UserRole.ADMIN));

// 1. Get all users
router.get("/users", adminController.getAllUsers);

// 2. Manage user status (suspend/activate)
router.patch("/users/:id", adminController.updateUserStatus);

// 3. Get all gear listings
router.get("/gear", adminController.getAllGears);

// 4. Get all rental orders
router.get("/rentals", adminController.getAllRentals);

export const adminRouter = router;