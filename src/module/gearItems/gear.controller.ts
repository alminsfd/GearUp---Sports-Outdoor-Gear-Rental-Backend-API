import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { gearService } from "./gear.service";

const creategear = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const id = req.user?.id;
     const payload = req.body;

     const result = await gearService.creategearOnDb(payload, id as string);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "Gear item created successfully",
          data: result,
     });
});


// Update Gear
const updateGear = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id as string;
     const providerId = req.user?.id as string;
     const payload = req.body;

     const result = await gearService.updateGearInDb(id, payload, providerId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Gear listing updated successfully",
          data: result,
     });
});

// Delete Gear
const deleteGear = catchAsync(async (req: Request, res: Response) => {
     const id = req.params.id as string;
     const providerId = req.user?.id as string;

     const result = await gearService.deleteGearFromDb(id, providerId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Gear removed from inventory successfully",
          data: result,
     });
});



export const gearController = {
     creategear,
     updateGear,
     deleteGear,
};