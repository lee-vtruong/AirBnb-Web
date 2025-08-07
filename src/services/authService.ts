import api from '@/lib/api';
import { AuthResponse, NguoiDung } from '@/types/user.types';

interface SignInPayload {
    email: string;
    password: string;
}

// Giả sử API signup nhận các trường này
type SignUpPayload = Omit<NguoiDung, 'id' | 'role' | 'avatar'> & { password: string };


const authService = {
    signIn: (data: SignInPayload) => api.post<AuthResponse>('/api/auth/signin', data),
    signUp: (data: SignUpPayload) => api.post<AuthResponse>('/api/auth/signup', data),
};

export default authService;