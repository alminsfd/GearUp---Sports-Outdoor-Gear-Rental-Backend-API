import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { categoryController } from "./catagory.controller";


const router = Router();

//  Public Routes 
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getSingleCategory);

// Protected Routes ( Admin এবং Provider )
router.post(
     "/",
     auth(UserRole.ADMIN, UserRole.PROVIDER),
     categoryController.createCategory
);

router.put(
     "/:id",
     auth(UserRole.ADMIN, UserRole.PROVIDER),
     categoryController.updateCategory
);

router.delete(
     "/:id",
     auth(UserRole.ADMIN, UserRole.PROVIDER),
     categoryController.deleteCategory
);

export const categoryRouter = router;