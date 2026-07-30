import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { gearController } from "./gear.controller";

const router = Router();

router.post(
     "/provider",
     auth(UserRole.ADMIN, UserRole.PROVIDER),
     gearController.creategear
);

router.put(
     "/provider/:id",
     auth(UserRole.PROVIDER, UserRole.ADMIN),
     gearController.updateGear
);

// Delete Gear
router.delete(
     "/provider/:id",
     auth(UserRole.PROVIDER, UserRole.ADMIN),
     gearController.deleteGear
);

export const gearRouter = router; 