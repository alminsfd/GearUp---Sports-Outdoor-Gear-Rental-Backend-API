export interface ICreateCategoryPayload {
     name: string;
     description?: string;
     icon?: string;
}

export type IUpdateCategoryPayload = Partial<ICreateCategoryPayload>;