import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { checkoutService } from './checkout.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// POST: Save Checkout Data
const createCheckout = catchAsync(async (req: Request, res: Response) => {
     const result = await checkoutService.saveCheckoutData(req.body);

     sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: 'Checkout information saved successfully',
          data: result,
     });
});

// GET: Fetch Checkout Data by rentalOrderId
const getCheckout = catchAsync(async (req: Request, res: Response) => {
     const { rentalOrderId } = req.params;
     const result = await checkoutService.getCheckoutByOrderId(rentalOrderId as string);

     sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: 'Checkout information retrieved successfully',
          data: result,
     });
});

export const checkoutController = {
     createCheckout,
     getCheckout,
};