
import { Prisma } from "../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { IUserFilterOptions, IUpdateUserStatusPayload } from "./admin.interface";

// 1. Get All Users (With Search & Pagination)
const getAllUsersFromDb = async (filters: IUserFilterOptions) => {
     const { searchTerm, role, status, page = 1, limit = 10 } = filters;

     const skip = (Number(page) - 1) * Number(limit);
     const take = Number(limit);

     const whereConditions: Prisma.UserWhereInput[] = [];

     if (searchTerm) {
          whereConditions.push({
               OR: [
                    { name: { contains: searchTerm, mode: "insensitive" } },
                    { email: { contains: searchTerm, mode: "insensitive" } },
               ],
          });
     }

     if (role) {
          whereConditions.push({ role: role as any });
     }

     if (status) {
          whereConditions.push({ status });
     }

     const whereClause: Prisma.UserWhereInput =
          whereConditions.length > 0 ? { AND: whereConditions } : {};

     const users = await prisma.user.findMany({
          where: whereClause,
          select: {
               id: true,
               name: true,
               email: true,
               role: true,
               status: true,
               profileImage: true,
               createdAt: true,
               updatedAt: true,
               _count: {
                    select: {
                         gears: true,
                         rentalOrders: true,
                    }
               }
          },
          skip,
          take,
          orderBy: { createdAt: "desc" },
     });

     const total = await prisma.user.count({ where: whereClause });

     return {
          meta: {
               page: Number(page),
               limit: Number(limit),
               total,
               totalPage: Math.ceil(total / Number(limit)),
          },
          data: users,
     };
};

// 2. Manage User Status (Suspend / Activate)
const updateUserStatusInDb = async (
     targetUserId: string,
     payload: IUpdateUserStatusPayload,
     adminUserId: string
) => {
     // ১. Admins should not suspend their own accounts.
     if (targetUserId === adminUserId) {
          throw new Error("Action denied! Admin cannot suspend their own account.");
     }

     const user = await prisma.user.findUnique({
          where: { id: targetUserId },
     });

     if (!user) {
          throw new Error("User not found!");
     }

     const result = await prisma.user.update({
          where: { id: targetUserId },
          data: { status: payload.status },
          select: {
               id: true,
               name: true,
               email: true,
               role: true,
               status: true,
               updatedAt: true,
          },
     });

     return result;
};

// 3. View All Gear Listings (Admin Analytics View)
const getAllGearsForAdminFromDb = async (page = 1, limit = 10) => {
     const skip = (Number(page) - 1) * Number(limit);
     const take = Number(limit);

     const gears = await prisma.gearItem.findMany({
          include: {
               category: { select: { id: true, name: true } },
               provider: { select: { id: true, name: true, email: true } },
               _count: { select: { rentalOrders: true, reviews: true } },
          },
          skip,
          take,
          orderBy: { createdAt: "desc" },
     });

     const total = await prisma.gearItem.count();

     return {
          meta: {
               page: Number(page),
               limit: Number(limit),
               total,
               totalPage: Math.ceil(total / Number(limit)),
          },
          data: gears,
     };
};

// 4. View All Rental Orders System-Wide
const getAllRentalsForAdminFromDb = async (page = 1, limit = 10) => {
     const skip = (Number(page) - 1) * Number(limit);
     const take = Number(limit);

     const rentals = await prisma.rentalOrder.findMany({
          include: {
               customer: { select: { id: true, name: true, email: true } },
               gearItem: {
                    select: {
                         id: true,
                         title: true,
                         pricePerDay: true,
                         provider: { select: { id: true, name: true, email: true } },
                    },
               },
               payment: true,
          },
          skip,
          take,
          orderBy: { createdAt: "desc" },
     });

     const total = await prisma.rentalOrder.count();

     return {
          meta: {
               page: Number(page),
               limit: Number(limit),
               total,
               totalPage: Math.ceil(total / Number(limit)),
          },
          data: rentals,
     };
};

export const adminService = {
     getAllUsersFromDb,
     updateUserStatusInDb,
     getAllGearsForAdminFromDb,
     getAllRentalsForAdminFromDb,
};