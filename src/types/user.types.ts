export interface NguoiDung {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthday: string;
    avatar: string;
    gender: boolean;
    role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
    user: NguoiDung;
    token: string;
}