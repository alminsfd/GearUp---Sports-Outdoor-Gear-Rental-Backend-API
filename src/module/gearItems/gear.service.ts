import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreategeartPayload, IGearFilters, IPaginationOptions, IUpdateAvailabilityPayload, IUpdateGearPayload, IUpdateStockPayload } from "./gear.interface";

const creategearOnDb = async (payload: ICreategeartPayload, userId: string) => {
     // findUniqueOrThrow 
     await prisma.user.findUniqueOrThrow({
          where: {
               id: userId,
          },
     });

     const result = await prisma.gearItem.create({
          data: {
               ...payload,
               providerId: userId,
          },
     });

     return result;
};


const updateGearInDb = async (
     gearId: string,
     payload: IUpdateGearPayload,
     providerId: string
) => {
     const isGearExist = await prisma.gearItem.findUnique({
          where: { id: gearId },
     });

     if (!isGearExist) {
          throw new Error("Gear item not found!");
     }

     if (isGearExist.providerId !== providerId) {
          throw new Error("Unauthorized! You can only update your own gear listings.");
     }


     if (payload.categoryId) {
          const isCategoryExist = await prisma.category.findUnique({
               where: { id: payload.categoryId },
          });
          if (!isCategoryExist) {
               throw new Error("Category not found!");
          }
     }

     const result = await prisma.gearItem.update({
          where: { id: gearId },
          data: payload,
     });

     return result;
};


const deleteGearFromDb = async (gearId: string, providerId: string) => {
     const isGearExist = await prisma.gearItem.findUnique({
          where: { id: gearId },
     });

     if (!isGearExist) {
          throw new Error("Gear item not found!");
     }

     if (isGearExist.providerId !== providerId) {
          throw new Error("Unauthorized! You can only delete your own gear listings.");
     }

     const result = await prisma.gearItem.delete({
          where: { id: gearId },
     });

     return result;
};

// 1. Get All Gear with Filters & Pagination
const getAllGearsFromDb = async (
     filters: IGearFilters,
     paginationOptions: IPaginationOptions
) => {
     const { searchTerm, category, brand, minPrice, maxPrice, isAvailable } = filters;
     const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = paginationOptions;

     const skip = (Number(page) - 1) * Number(limit);
     const take = Number(limit);

     // Dynamic Query Building
     const whereConditions: Prisma.GearItemWhereInput[] = [];

     // Search by title or description
     if (searchTerm) {
          whereConditions.push({
               OR: [
                    { title: { contains: searchTerm, mode: "insensitive" } },
                    { description: { contains: searchTerm, mode: "insensitive" } },
               ],
          });
     }

     // Filter by Category (Name or ID)
     if (category) {
          whereConditions.push({
               OR: [
                    { categoryId: category },
                    { category: { name: { contains: category, mode: "insensitive" } } },
               ],
          });
     }

     // Filter by Brand
     if (brand) {
          whereConditions.push({
               brand: { equals: brand, mode: "insensitive" },
          });
     }

     // Filter by Availability
     if (isAvailable !== undefined) {
          whereConditions.push({
               isAvailable: isAvailable,
          });
     }

     // Filter by Price Range
     if (minPrice !== undefined || maxPrice !== undefined) {
          whereConditions.push({
               pricePerDay: {
                    gte: minPrice !== undefined ? Number(minPrice) : undefined,
                    lte: maxPrice !== undefined ? Number(maxPrice) : undefined,
               },
          });
     }

     const whereClause: Prisma.GearItemWhereInput =
          whereConditions.length > 0 ? { AND: whereConditions } : {};

     // Fetch Data & Total Count
     const result = await prisma.gearItem.findMany({
          where: whereClause,
          include: {
               category: {
                    select: {
                         id: true,
                         name: true,
                    },
               },
               provider: {
                    select: {
                         id: true,
                         name: true,
                         email: true,
                    },
               },
          },
          skip,
          take,
          orderBy: {
               [sortBy]: sortOrder,
          },
     });

     const total = await prisma.gearItem.count({ where: whereClause });

     return {
          meta: {
               page: Number(page),
               limit: Number(limit),
               total,
               totalPage: Math.ceil(total / Number(limit)),
          },
          data: result,
     };
};

// 2. Get Single Gear Details by ID
const getSingleGearFromDb = async (id: string) => {
     const result = await prisma.gearItem.findUnique({
          where: { id },
          include: {
               category: true,
               provider: {
                    select: {
                         id: true,
                         name: true,
                         email: true,
                         phone: true,
                    },
               },
               reviews: {
                    include: {
                         customer: {
                              select: {
                                   id: true,
                                   name: true,
                              },
                         },
                    },
               },
          },
     });

     if (!result) {
          throw new Error("Gear item not found!");
     }

     return result;
};


const updateStockInDb = async (
     gearId: string,
     payload: IUpdateStockPayload,
     providerId: string
) => {
     const { stock } = payload;

     if (stock < 0) {
          throw new Error("Stock count cannot be negative!");
     }

     // ownwership check
     const gear = await prisma.gearItem.findUnique({
          where: { id: gearId },
     });

     if (!gear) {
          throw new Error("Gear item not found!");
     }

     if (gear.providerId !== providerId) {
          throw new Error("Unauthorized! You can only update stock for your own gear.");
     }

     // automatic available change
     const isAvailable = stock > 0 ? gear.isAvailable : false;

     const result = await prisma.gearItem.update({
          where: { id: gearId },
          data: {
               stock,
               isAvailable,
          },
     });

     return result;
};

// 2. Toggle Availability Status
const updateAvailabilityInDb = async (
     gearId: string,
     payload: IUpdateAvailabilityPayload,
     providerId: string
) => {
     const { isAvailable } = payload;

     // ownwership check
     const gear = await prisma.gearItem.findUnique({
          where: { id: gearId },
     });

     if (!gear) {
          throw new Error("Gear item not found!");
     }

     if (gear.providerId !== providerId) {
          throw new Error("Unauthorized! You can only update availability for your own gear.");
     }


     if (isAvailable && gear.stock <= 0) {
          throw new Error("Cannot make gear available when stock is 0! Update stock first.");
     }

     const result = await prisma.gearItem.update({
          where: { id: gearId },
          data: {
               isAvailable,
          },
     });

     return result;
};


export const gearService = {
     creategearOnDb,
     updateGearInDb,
     deleteGearFromDb,
     getSingleGearFromDb,
     getAllGearsFromDb,
     updateStockInDb,
     updateAvailabilityInDb
}              