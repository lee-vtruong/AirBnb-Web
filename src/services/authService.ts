import api from '@/lib/api';
import { User } from '@/types/auth.types'; 

interface SignInPayload {
    email: string;
    password: string;
}

interface SignUpPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: boolean;
}

interface AuthResponse {
    user: User;
    token: string;
}

interface ApiResponse {
    statusCode: number;
    content: AuthResponse;
    dateTime: string;
}

const TOKEN_CYBERSOFT = process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTEiLCJIZXRIYW5TdHJpbmciOiIxNC8wMi8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzEwMjcyMDAwMDAiLCJuYmYiOjE3NTE5OTc2MDAsImV4cCI6MTc3MTE3ODQwMH0.JG5__XHVipsXW58_ZhijRt1DzTA4UD1j1lcvaZPd9mo';

const authService = {
    signIn: (data: SignInPayload) =>
        api.post<ApiResponse>('/api/auth/signin', data, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),

    signUp: (data: SignUpPayload) =>
        api.post<ApiResponse>('/api/auth/signup', data, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),
};

export default authService;