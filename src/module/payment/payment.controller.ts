import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

// Create Payment Session
const createPayment = catchAsync(async (req: Request, res: Response) => {
     const userId = req.user?.id as string;
     const result = await paymentService.createPaymentSessionInDb(req.body, userId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Payment session created successfully",
          data: result,
     });
});

// Confirm/Verify Payment (Callback URL from SSLCommerz)
const confirmPayment = catchAsync(async (req: Request, res: Response) => {
     const result = await paymentService.confirmPaymentInDb(req.query, req.body);

     const clientFrontendUrl = process.env.FRONTEND_URL as string;

     // Redirect user back to Frontend Payment Result Page
     if (result.status === "SUCCESS") {
          return res.redirect(`${clientFrontendUrl}/payment/success?txnId=${result.payment.transactionId}`);
     } else {
          return res.redirect(`${clientFrontendUrl}/payment/fail?txnId=${result.payment.transactionId}`);
     }
});

// Get User Payment History
const getUserPayments = catchAsync(async (req: Request, res: Response) => {
     const userId = req.user?.id as string;
     const { page, limit } = req.query;

     const result = await paymentService.getUserPaymentHistoryFromDb(
          userId,
          page ? Number(page) : 1,
          limit ? Number(limit) : 10
     );

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Payment history retrieved successfully",
          meta: result.meta,
          data: result.data,
     });
});

// Get Single Payment Details
const getPaymentById = catchAsync(async (req: Request, res: Response) => {
     const userId = req.user?.id as string;
     const { id } = req.params;

     const result = await paymentService.getPaymentByIdFromDb(id as string, userId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Payment details retrieved successfully",
          data: result,
     });
});

export const paymentController = {
     createPayment,
     confirmPayment,
     getUserPayments,
     getPaymentById,
};