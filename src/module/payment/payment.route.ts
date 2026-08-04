import { Router } from "express";
import { auth } from "../../middleware/auth";

import { paymentController } from "./payment.controller";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

// 1. Create payment session
router.post("/create", auth(UserRole.CUSTOMER), paymentController.createPayment);

// 2. SSLCommerz Redirect / Callback Endpoint (No auth middleware needed because SSLCommerz sends HTTP POST/GET redirect)
router.post("/confirm", paymentController.confirmPayment);
router.get("/confirm", paymentController.confirmPayment);

// 3. Get user payment history
router.get("/", auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN), paymentController.getUserPayments);

// 4. Get single payment details
router.get("/:id", auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN), paymentController.getPaymentById);

export const paymentRouter = router;