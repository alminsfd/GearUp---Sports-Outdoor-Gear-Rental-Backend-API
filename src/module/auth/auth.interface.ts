import { UserRole } from "../../../generated/prisma/enums";

export interface ILoginUser {
     email: string;
     password: string;
}

export interface RegisterUserPayload {
     name: string;
     email: string;
     password: string;
     profileImage?: string;
     role?: UserRole;
}