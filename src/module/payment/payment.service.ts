import SSLCommerzPayment from "sslcommerz-lts";
import { prisma } from "../../lib/prisma";
import { ICreatePaymentPayload, ISSLCommerzCallbackPayload } from "./payment.interface";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums";
import config from "../../config";

const store_id = config.store_id as string;
const store_passwd = config.store_password as string;
const is_live = config.is_live === "true";

// 1. Create SSLCommerz Payment Session
const createPaymentSessionInDb = async (
     payload: ICreatePaymentPayload,
     userId: string
) => {
     const rentalOrder = await prisma.rentalOrder.findUnique({
          where: { id: payload.rentalOrderId },
          include: {
               customer: true,
               gearItem: true,
          },
     });

     if (!rentalOrder) {
          throw new Error("Rental order not found!");
     }

     if (rentalOrder.customerId !== userId) {
          throw new Error("Unauthorized access to this rental order!");
     }

     const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

     // Save initial payment record in DB
     await prisma.payment.create({
          data: {
               rentalOrderId: rentalOrder.id,
               amount: rentalOrder.totalAmount,
               transactionId,
               paymentMethod: PaymentMethod.SSLCOMMERZ,
               status: PaymentStatus.PENDING,
          },
     });

     // SSLCommerz configuration payload
     const sslData = {
          total_amount: rentalOrder.totalAmount,
          currency: "BDT",
          tran_id: transactionId,
          // 🔗SSLCommerz পেমেন্ট শেষে আপনার এই ব্যাকএন্ড URL-গুলোতে POST হিট করবে
          success_url: `${process.env.BACKEND_BASE_URL}/api/payments/confirm?status=success&tran_id=${transactionId}`,
          fail_url: `${process.env.BACKEND_BASE_URL}/api/payments/confirm?status=fail&tran_id=${transactionId}`,
          cancel_url: `${process.env.BACKEND_BASE_URL}/api/payments/confirm?status=cancel&tran_id=${transactionId}`,
          ipn_url: `${process.env.BACKEND_BASE_URL}/api/payments/ipn`,
          shipping_method: "NO",
          product_name: rentalOrder.gearItem.title || "Gear Rental",
          product_category: "Gear Rental",
          product_profile: "general",
          cus_name: rentalOrder.customer.name || "Customer",
          cus_email: rentalOrder.customer.email || "customer@gmail.com",
          cus_add1: rentalOrder.customer.address || "Dhaka, Bangladesh",
          cus_city: "Dhaka",
          cus_postcode: "1000",
          cus_country: "Bangladesh",
          cus_phone: rentalOrder.customer.phone || "01700000000",
     };
     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
     const apiResponse = await sslcz.init(sslData);
     if (apiResponse?.GatewayPageURL) {
          return { paymentUrl: apiResponse.GatewayPageURL, transactionId };
     } else {
          throw new Error(
               `Failed to initiate SSLCommerz payment session! Reason: ${JSON.stringify(
                    apiResponse
               )}`
          );
     }
};

// 2. Validate and Confirm Payment Callback
const confirmPaymentInDb = async (
     queryParams: any,
     bodyParams: ISSLCommerzCallbackPayload
) => {
     const { status, tran_id } = queryParams;
     const transactionId = tran_id || bodyParams.tran_id;

     const payment = await prisma.payment.findUnique({
          where: { transactionId },
     });

     if (!payment) {
          throw new Error("Payment record not found!");
     }

     // Handle Successful Payment
     if (status === "success" || bodyParams.status === "VALID") {
          const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
          const validateResponse = await sslcz.validate({ val_id: bodyParams.val_id });

          if (validateResponse?.status === "VALID" || validateResponse?.status === "VALIDATED") {
               // Transaction to update Payment and Order status consistently
               return await prisma.$transaction(async (tx) => {
                    const updatedPayment = await tx.payment.update({
                         where: { id: payment.id },
                         data: {
                              status: PaymentStatus.PAID,
                              paidAt: new Date(),
                         },
                    });

                    // Update Rental Order status using OrderStatus enum
                    await tx.rentalOrder.update({
                         where: { id: payment.rentalOrderId },
                         data: { status: OrderStatus.PAID },
                    });

                    return { status: "SUCCESS", payment: updatedPayment };
               });
          }
     }

     // Handle Cancelled or Failed Payment
     const newPaymentStatus = status === "cancel" ? PaymentStatus.FAILED : PaymentStatus.FAILED;

     const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: { status: newPaymentStatus },
     });

     return { status: newPaymentStatus, payment: updatedPayment };
};

// 3. Get User Payment History
const getUserPaymentHistoryFromDb = async (
     userId: string,
     page = 1,
     limit = 10
) => {
     const skip = (Number(page) - 1) * Number(limit);
     const take = Number(limit);

     // RentalOrder-এর কাস্টমার আইডি দিয়ে Payment ফিল্টার করা হচ্ছে
     const payments = await prisma.payment.findMany({
          where: {
               rentalOrder: {
                    customerId: userId,
               },
          },
          include: {
               rentalOrder: {
                    include: {
                         gearItem: { select: { id: true, title: true, images: true } },
                    },
               },
          },
          skip,
          take,
          orderBy: { createdAt: "desc" },
     });

     const total = await prisma.payment.count({
          where: {
               rentalOrder: {
                    customerId: userId,
               },
          },
     });

     return {
          meta: {
               page: Number(page),
               limit: Number(limit),
               total,
               totalPage: Math.ceil(total / Number(limit)),
          },
          data: payments,
     };
};

// 4. Get Single Payment Details
const getPaymentByIdFromDb = async (paymentId: string, userId: string) => {
     const payment = await prisma.payment.findUnique({
          where: { id: paymentId },
          include: {
               rentalOrder: {
                    include: {
                         customer: {
                              select: { id: true, name: true, email: true },
                         },
                         gearItem: {
                              select: {
                                   id: true,
                                   title: true,
                                   pricePerDay: true,
                              },
                         },
                    },
               },
          },
     });

     if (!payment) {
          throw new Error("Payment record not found!");
     }

     // Authorization check via relation
     if (payment.rentalOrder.customerId !== userId) {
          throw new Error("Unauthorized access to payment details!");
     }

     return payment;
};

export const paymentService = {
     createPaymentSessionInDb,
     confirmPaymentInDb,
     getUserPaymentHistoryFromDb,
     getPaymentByIdFromDb,
};