import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { userService } from "./user.service";

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const userId = req.user?.id as string;

     const payload = req.body;

     const updatedProfile = await userService.updateMyProfileInDB(userId, payload);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User profile updated successfully",
          data: { updatedProfile }
     })
})
const deleteMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     const userId = req.user?.id as string;

     if (!userId) {
          throw new Error("User doesn't exits")

     }

     const deleteProfile = await userService.deleteMyProfileInDB(userId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "User profile delete successfully",
          data: { deleteProfile }
     })
})

export const userController = {
     updateMyProfile,
     deleteMyProfile
}