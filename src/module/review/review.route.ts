import { Router } from "express";

import { auth } from "../../middleware/auth";
import { reviewController } from "./review.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

//  Public: Get all reviews for a specific gear item
router.get("/gear/:gearItemId", reviewController.getGearReviews);

//  Protected: Customer can create review
router.post(
     "/",
     auth(UserRole.CUSTOMER),
     reviewController.createReview
);

//  Protected: Update own review
router.put(
     "/:id",
     auth(UserRole.CUSTOMER),
     reviewController.updateReview
);

//  Protected: Delete own review (or Admin)
router.delete(
     "/:id",
     auth(UserRole.CUSTOMER, UserRole.ADMIN),
     reviewController.deleteReview
);

export const reviewRouter = router;