import { prisma } from "../lib/prisma";
import { ICreateCheckoutPayload } from "./checkout.interface";



const saveCheckoutData = async (payload: ICreateCheckoutPayload) => {
     const { rentalOrderId, totalAmount, paymentMethod, shippingAddress, orderNote } = payload;

     const checkoutData = await prisma.checkout.upsert({
          where: { rentalOrderId },
          update: {
               totalAmount,
               paymentMethod,
               fullName: shippingAddress.fullName,
               phoneNumber: shippingAddress.phoneNumber,
               streetAddress: shippingAddress.streetAddress,
               city: shippingAddress.city,
               area: shippingAddress.area,
               orderNote
          },
          create: {
               rentalOrderId,
               totalAmount,
               paymentMethod,
               fullName: shippingAddress.fullName,
               phoneNumber: shippingAddress.phoneNumber,
               streetAddress: shippingAddress.streetAddress,
               city: shippingAddress.city,
               area: shippingAddress.area,
               orderNote
          },
     });

     return checkoutData;
};


const getCheckoutByOrderId = async (rentalOrderId: string) => {
     const result = await prisma.checkout.findUnique({
          where: { rentalOrderId },
     });
     return result;
};

export const checkoutService = {
     saveCheckoutData,
     getCheckoutByOrderId,
};