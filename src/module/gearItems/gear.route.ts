import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { gearController } from "./gear.controller";

const router = Router();

router.get("/", gearController.getAllGears);
router.get("/:id", gearController.getSingleGear);

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

//  Update Stock (Provider & Admin)
router.patch(
     "/provider/gear/:id/stock",
     auth(UserRole.PROVIDER, UserRole.ADMIN),
     gearController.updateStock
);

//  Update Availability Status (Provider & Admin)
router.patch(
     "/provider/gear/:id/availability",
     auth(UserRole.PROVIDER, UserRole.ADMIN),
     gearController.updateAvailability
);


export const gearRouter = router; 