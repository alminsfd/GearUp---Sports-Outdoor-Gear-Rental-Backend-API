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

export const gearController = {
     creategear,
};