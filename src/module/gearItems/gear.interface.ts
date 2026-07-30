export interface ICreategeartPayload {
     title: string;
     description: string;
     pricePerDay: number;
     brand: string;
     categoryId: string;
     stock?: number;
     isAvailable?: boolean;
     images?: string[];
}

export type IUpdateGearPayload = Partial<ICreategeartPayload>;