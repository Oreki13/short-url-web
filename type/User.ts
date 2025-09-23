import { ApiResponse } from './ApiResponse';

export interface UserRole {
    name: string;
}

export interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: UserRole | null;
    createdAt: string;
    updatedAt: string;
}

export type UserDetailResponse = ApiResponse & {
    data: UserDetail | null;
};
