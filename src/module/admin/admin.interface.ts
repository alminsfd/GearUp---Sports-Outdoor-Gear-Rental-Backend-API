import { UserStatus } from "../../../generated/prisma/enums";

export interface IUserFilterOptions {
     searchTerm?: string;
     role?: string;
     status?: UserStatus;
     page?: number;
     limit?: number;
}

export interface IUpdateUserStatusPayload {
     status: UserStatus; // e.g. ACTIVE, SUSPENDED
}