import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums"; // 👈 নিশ্চিত করো এই পাথটি ঠিক আছে (অথবা @prisma/client)
import { auth } from "../../middleware/auth";
import { gearController } from "./gear.controller";

const router = Router();

router.post(
     "/provider",
     auth(UserRole.ADMIN, UserRole.PROVIDER),
     gearController.creategear
);

export const gearRouter = router; 