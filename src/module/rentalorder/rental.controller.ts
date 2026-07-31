import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";

// Create Rental Order
const createRentalOrder = catchAsync(async (req: Request, res: Response) => {
     const customerId = req.user?.id as string;
     const result = await rentalService.createRentalOrderInDb(req.body, customerId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "Rental order placed successfully",
          data: result,
     });
});

// Get My Orders (Customer/Provider)
const getMyRentalOrders = catchAsync(async (req: Request, res: Response) => {
     const userId = req.user?.id as string;
     const role = req.user?.role as string;

     const result = await rentalService.getMyRentalOrdersFromDb(userId, role);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Rental orders fetched successfully",
          data: result,
     });
});

// Get Order Details
const getRentalOrderDetails = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const userId = req.user?.id as string;
     const role = req.user?.role as string;

     const result = await rentalService.getRentalOrderDetailsFromDb(id as string, userId, role);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Rental order details fetched successfully",
          data: result,
     });
});

// Update Order Status
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const { status } = req.body;
     const userId = req.user?.id as string;
     const role = req.user?.role as string;

     const result = await rentalService.updateOrderStatusInDb(id as string, status, userId, role);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: `Order status updated to ${status} successfully`,
          data: result,
     });
});

export const rentalController = {
     createRentalOrder,
     getMyRentalOrders,
     getRentalOrderDetails,
     updateOrderStatus,
};