// types/auth.types.ts
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    avatar: string;
    gender: boolean;
    role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiResponse {
    statusCode: number;
    content: AuthResponse;
    dateTime: string;
}