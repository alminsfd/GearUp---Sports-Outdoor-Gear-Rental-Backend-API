import { OrderStatus } from "../../../generated/prisma/enums";


export interface ICreateRentalPayload {
     gearItemId: string;
     startDate: string;
     endDate: string;
}

export interface IUpdateOrderStatusPayload {
     status: OrderStatus;
}