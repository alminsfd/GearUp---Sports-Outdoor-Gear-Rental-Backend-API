import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateRentalPayload } from "./rental.interface";

// 1. Place Rental Order (Customer)
const createRentalOrderInDb = async (
     payload: ICreateRentalPayload,
     customerId: string
) => {
     const { gearItemId, startDate, endDate } = payload;

     const start = new Date(startDate);
     const end = new Date(endDate);

     if (start >= end) {
          throw new Error("End date must be after start date!");
     }

     // gear item checks
     const gearItem = await prisma.gearItem.findUnique({
          where: { id: gearItemId },
     });

     if (!gearItem) {
          throw new Error("Gear item not found!");
     }

     if (!gearItem.isAvailable || gearItem.stock <= 0) {
          throw new Error("Gear item is currently not available for rent!");
     }

     // (Total Days Calculation)
     const diffTime = Math.abs(end.getTime() - start.getTime());
     const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

     //  (Total Amount Calculation)
     const totalAmount = totalDays * gearItem.pricePerDay;

     // order make
     const result = await prisma.rentalOrder.create({
          data: {
               customerId,
               gearItemId,
               startDate: start,
               endDate: end,
               totalDays,
               totalAmount,
               status: OrderStatus.PLACED,
          },
          include: {
               gearItem: true,
               customer: {
                    select: { id: true, name: true, email: true },
               },
          },
     });

     return result;
};

// 2. Get User's Rental Orders (Customer & Provider Both)
const getMyRentalOrdersFromDb = async (userId: string, role: string) => {
     if (role === "CUSTOMER") {
          return await prisma.rentalOrder.findMany({
               where: { customerId: userId },
               include: {
                    gearItem: true,
                    payment: true,
               },
               orderBy: { createdAt: "desc" },
          });
     } else if (role === "PROVIDER") {
          //The provider will only see orders for the gear they have placed.
          return await prisma.rentalOrder.findMany({
               where: {
                    gearItem: {
                         providerId: userId,
                    },
               },
               include: {
                    gearItem: true,
                    customer: {
                         select: { id: true, name: true, email: true, phone: true },
                    },
                    payment: true,
               },
               orderBy: { createdAt: "desc" },
          });
     }
};

// 3. Get Single Rental Order Details
const getRentalOrderDetailsFromDb = async (orderId: string, userId: string, role: string) => {
     const order = await prisma.rentalOrder.findUnique({
          where: { id: orderId },
          include: {
               gearItem: {
                    include: {
                         provider: {
                              select: { id: true, name: true, email: true, phone: true },
                         },
                    },
               },
               customer: {
                    select: { id: true, name: true, email: true, phone: true },
               },
               payment: true,
          },
     });

     if (!order) {
          throw new Error("Rental order not found!");
     }

     // Security Check: No one except the customer or provider can see (except Admin)
     if (
          role !== "ADMIN" &&
          order.customerId !== userId &&
          order.gearItem.providerId !== userId
     ) {
          throw new Error("Unauthorized! You do not have access to this order.");
     }

     return order;
};

// 4. Update Order Status (Provider & Customer Action)
const updateOrderStatusInDb = async (
     orderId: string,
     status: OrderStatus,
     userId: string,
     role: string
) => {
     const order = await prisma.rentalOrder.findUnique({
          where: { id: orderId },
          include: { gearItem: true },
     });

     if (!order) {
          throw new Error("Rental order not found!");
     }

     if (order.status === OrderStatus.CANCELLED) {
          throw new Error("Cannot update status! This order has already been cancelled.");
     }
     if (order.status === OrderStatus.RETURNED) {
          throw new Error("Cannot update status! This rental order is already returned.");
     }
     // Customer can only cancel (if in PLACED status)
     if (role === "CUSTOMER") {
          if (order.customerId !== userId) {
               throw new Error("Unauthorized action!");
          }
          if (status !== OrderStatus.CANCELLED) {
               throw new Error("Customers can only cancel orders!");
          }
          if (order.status !== OrderStatus.PLACED) {
               throw new Error("Order cannot be cancelled at this stage!");
          }
     }

     // Provider will confirm, mark received/returned
     if (role === "PROVIDER") {
          if (order.gearItem.providerId !== userId) {
               throw new Error("Unauthorized action! This is not your gear order.");
          }
     }

     const result = await prisma.rentalOrder.update({
          where: { id: orderId },
          data: { status },
     });

     return result;
};

export const rentalService = {
     createRentalOrderInDb,
     getMyRentalOrdersFromDb,
     getRentalOrderDetailsFromDb,
     updateOrderStatusInDb,
};


