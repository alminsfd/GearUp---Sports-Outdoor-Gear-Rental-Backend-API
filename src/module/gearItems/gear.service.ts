import { prisma } from "../../lib/prisma";
import { ICreategeartPayload } from "./gear.interface";

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

export const gearService = {
     creategearOnDb,
};