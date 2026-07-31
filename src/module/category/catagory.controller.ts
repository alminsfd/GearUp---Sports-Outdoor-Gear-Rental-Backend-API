import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./catagory.service";


// Create Category
const createCategory = catchAsync(async (req: Request, res: Response) => {
     const result = await categoryService.createCategoryInDb(req.body);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "Category created successfully",
          data: result,
     });
});

// Get All Categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
     const result = await categoryService.getAllCategoriesFromDb();

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Categories fetched successfully",
          data: result,
     });
});

// Get Single Category
const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await categoryService.getSingleCategoryFromDb(id as string);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Category details fetched successfully",
          data: result,
     });
});

// Update Category
const updateCategory = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await categoryService.updateCategoryInDb(id as string, req.body);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Category updated successfully",
          data: result,
     });
});

// Delete Category
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
     const { id } = req.params;
     const result = await categoryService.deleteCategoryFromDb(id as string);

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: "Category deleted successfully",
          data: result,
     });
});

export const categoryController = {
     createCategory,
     getAllCategories,
     getSingleCategory,
     updateCategory,
     deleteCategory,
};