import { prisma } from "../../lib/prisma";
import { ICreategeartPayload, IUpdateGearPayload } from "./gear.interface";

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



export const gearService = {
     creategearOnDb,
     updateGearInDb,
     deleteGearFromDb
}              