import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload, IUpdateCategoryPayload } from "./category.interface";

//  Create Category (Admin / Provider)
const createCategoryInDb = async (payload: ICreateCategoryPayload) => {
     const isCategoryExist = await prisma.category.findUnique({
          where: { name: payload.name },
     });

     if (isCategoryExist) {
          throw new Error("Category with this name already exists!");
     }

     const result = await prisma.category.create({
          data: payload,
     });

     return result;
};

//  Get All Categories (Public)
const getAllCategoriesFromDb = async () => {
     const result = await prisma.category.findMany({
          include: {
               _count: {
                    select: { gears: true },
               },
          },
     });

     return result;
};

// Get Single Category Details (Public)
const getSingleCategoryFromDb = async (id: string) => {
     const result = await prisma.category.findUnique({
          where: { id },
          include: {
               gears: true,
          },
     });

     if (!result) {
          throw new Error("Category not found!");
     }

     return result;
};

//  Update Category (Admin / Provider)
const updateCategoryInDb = async (id: string, payload: IUpdateCategoryPayload) => {
     const isCategoryExist = await prisma.category.findUnique({
          where: { id },
     });

     if (!isCategoryExist) {
          throw new Error("Category not found!");
     }


     if (payload.name) {
          const isNameTaken = await prisma.category.findUnique({
               where: { name: payload.name },
          });

          if (isNameTaken && isNameTaken.id !== id) {
               throw new Error("Another category with this name already exists!");
          }
     }

     const result = await prisma.category.update({
          where: { id },
          data: payload,
     });

     return result;
};

//  Delete Category (Admin / Provider)
const deleteCategoryFromDb = async (id: string) => {
     const isCategoryExist = await prisma.category.findUnique({
          where: { id },
     });

     if (!isCategoryExist) {
          throw new Error("Category not found!");
     }

     const result = await prisma.category.delete({
          where: { id },
     });

     return result;
};

export const categoryService = {
     createCategoryInDb,
     getAllCategoriesFromDb,
     getSingleCategoryFromDb,
     updateCategoryInDb,
     deleteCategoryFromDb,
};