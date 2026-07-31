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

// Get All Gear
const getAllGears = catchAsync(async (req: Request, res: Response) => {
     const {
          searchTerm,
          category,
          brand,
          minPrice,
          maxPrice,
          isAvailable,
          page,
          limit,
          sortBy,
          sortOrder,
     } = req.query;

     const filters = {
          searchTerm: searchTerm as string,
          category: category as string,
          brand: brand as string,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          isAvailable: isAvailable ? isAvailable === "true" : undefined,
     };

     const paginationOptions = {
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
          sortBy: sortBy as string,
          sortOrder: sortOrder as "asc" | "desc",
     };

     const result = await gearService.getAllGearsFromDb(filters, paginationOptions);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Gears fetched successfully",
          meta: result.meta,
          data: result.data,
     });
});

// Get Single Gear Details
const getSingleGear = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;

     const result = await gearService.getSingleGearFromDb(id as string);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Gear details fetched successfully",
          data: result,
     });
});

// manage stock status

const updateStock = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const providerId = req.user?.id as string;

     const result = await gearService.updateStockInDb(id as string, req.body, providerId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Gear stock updated successfully",
          data: result,
     });
});

// Manage Availability Status
const updateAvailability = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const providerId = req.user?.id as string;

     const result = await gearService.updateAvailabilityInDb(id as string , req.body, providerId);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Gear availability updated successfully",
          data: result,
     });
});


export const gearController = {
     creategear,
     updateGear,
     deleteGear,
     getAllGears,
     getSingleGear,
     updateStock,
     updateAvailability
};