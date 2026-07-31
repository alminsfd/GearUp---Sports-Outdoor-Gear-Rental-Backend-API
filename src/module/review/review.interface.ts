export interface ICreateReviewPayload {
     gearItemId: string;
     rating: number; // 1 to 5
     comment: string;
}

export interface IUpdateReviewPayload {
     rating?: number;
     comment?: string;
}