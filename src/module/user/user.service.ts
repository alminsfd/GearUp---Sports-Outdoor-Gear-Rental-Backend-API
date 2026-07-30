import { prisma } from "../../lib/prisma";

const updateMyProfileInDB = async (userId: string, payload: any) => {
     const { name, phone, address, profileImage } = payload;
     const user = await prisma.user.findUnique({
          where: { id: userId }
     });

     if (!user) {
          throw new Error("User not found. Please log in again.");
     }

     const updatedUser = await prisma.user.update({
          where: { id: userId },

          data: {
               name,
               phone,
               address,
               profileImage,
          },

          omit: {
               password: true
          },

     })

     return updatedUser;
}

const deleteMyProfileInDB = async (userId: string) => {
     const user = await prisma.user.findUnique({
          where: { id: userId }
     });

     if (!user) {
          throw new Error("User not found. Please log in again.");
     }
     await prisma.user.delete({
          where: {
               id: userId
          },
     })
}


export const userService = {

     updateMyProfileInDB,
     deleteMyProfileInDB

}