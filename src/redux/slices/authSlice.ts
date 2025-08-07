import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthResponse } from '@/types/auth.types';
import { ACCESS_TOKEN } from '@/utils/config'; 

interface AuthState {
    currentUser: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    currentUser: null,
    token: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.isLoading = false;
            state.error = null;

            if (typeof window !== 'undefined') {
                localStorage.setItem(ACCESS_TOKEN, action.payload.token);
                localStorage.setItem('user_info', JSON.stringify(action.payload.user));
            }
        },

        loadUserFromStorage: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem(ACCESS_TOKEN);
                const userInfo = localStorage.getItem('user_info');
                if (token && userInfo) {
                    state.token = token;
                    state.currentUser = JSON.parse(userInfo);
                }
            }
        },

        logout: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isLoading = false;
            state.error = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem('user_info');
            }
        },
    },
});

export const { loginSuccess, loadUserFromStorage, logout } = authSlice.actions;
export default authSlice.reducer;