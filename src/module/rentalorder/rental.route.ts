import { Router } from "express";
import { auth } from "../../middleware/auth";
import { rentalController } from "./rental.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

// Place Rental Order (Only Customer)
router.post(
     "/",
     auth(UserRole.CUSTOMER),
     rentalController.createRentalOrder
);

// Get Rental Orders (Customer & Provider can view their respective orders)
router.get(
     "/",
     auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
     rentalController.getMyRentalOrders
);

// Get Specific Rental Order Details
router.get(
     "/:id",
     auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
     rentalController.getRentalOrderDetails
);

// Update Status (Confirm, Picked_Up, Returned, Cancelled role respective)
router.patch(
     "/:id/status",
     auth(UserRole.PROVIDER, UserRole.CUSTOMER, UserRole.ADMIN),
     rentalController.updateOrderStatus
);

export const rentalRouter = router;