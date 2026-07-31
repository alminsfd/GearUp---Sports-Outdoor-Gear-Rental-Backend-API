import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

// Create Review
const createReview = catchAsync(async (req: Request, res: Response) => {
     const customerId = req.user?.id as string;

     const result = await reviewService.createReviewInDb(req.body, customerId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "Review posted successfully",
          data: result,
     });
});

// Get Reviews for a Gear
const getGearReviews = catchAsync(async (req: Request, res: Response) => {
     const { gearItemId } = req.params;

     const result = await reviewService.getGearReviewsFromDb(gearItemId as string);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Reviews fetched successfully",
          data: result,
     });
});

// Update Review
const updateReview = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const customerId = req.user?.id as string;

     const result = await reviewService.updateReviewInDb(id as string, req.body, customerId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Review updated successfully",
          data: result,
     });
});

// Delete Review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const userId = req.user?.id as string;
     const role = req.user?.role as string;

     const result = await reviewService.deleteReviewFromDb(id as string, userId, role);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Review deleted successfully",
          data: result,
     });
});

export const reviewController = {
     createReview,
     getGearReviews,
     updateReview,
     deleteReview,
};