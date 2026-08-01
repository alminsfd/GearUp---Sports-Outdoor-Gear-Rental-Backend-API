import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

// Get All Users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
     const { searchTerm, role, status, page, limit } = req.query;

     const filters = {
          searchTerm: searchTerm as string,
          role: role as string,
          status: status as any,
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
     };

     const result = await adminService.getAllUsersFromDb(filters);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Users retrieved successfully",
          meta: result.meta,
          data: result.data,
     });
});

// Update User Status
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const adminUserId = req.user?.id as string;

     const result = await adminService.updateUserStatusInDb(id as string, req.body, adminUserId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: `User status updated to ${req.body.status} successfully`,
          data: result,
     });
});

// Get All Gear Listings
const getAllGears = catchAsync(async (req: Request, res: Response) => {
     const { page, limit } = req.query;

     const result = await adminService.getAllGearsForAdminFromDb(
          page ? Number(page) : 1,
          limit ? Number(limit) : 10
     );

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All gear listings retrieved successfully",
          meta: result.meta,
          data: result.data,
     });
});

// Get All Rental Orders
const getAllRentals = catchAsync(async (req: Request, res: Response) => {
     const { page, limit } = req.query;

     const result = await adminService.getAllRentalsForAdminFromDb(
          page ? Number(page) : 1,
          limit ? Number(limit) : 10
     );

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "All rental orders retrieved successfully",
          meta: result.meta,
          data: result.data,
     });
});

export const adminController = {
     getAllUsers,
     updateUserStatus,
     getAllGears,
     getAllRentals,
};