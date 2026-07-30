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

export interface IGearFilters {
     searchTerm?: string;
     category?: string;
     brand?: string;
     minPrice?: number;
     maxPrice?: number;
     isAvailable?: boolean;
}

export interface IPaginationOptions {
     page?: number;
     limit?: number;
     sortBy?: string;
     sortOrder?: 'asc' | 'desc';
}

export type IUpdateGearPayload = Partial<ICreategeartPayload>;