// src/lib/api.ts

import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        // console.log('[API Interceptor] Đang thêm header...');
        // console.log('[API Interceptor] Token từ .env:', process.env.NEXT_PUBLIC_API_TOKEN)
        config.headers['tokenCybersoft'] = process.env.NEXT_PUBLIC_API_TOKEN;

        if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
            config.headers['Content-Type'] = 'application/json-patch+json';
        }


        if (typeof window !== 'undefined') {
            const userToken = localStorage.getItem('user_token');
            if (userToken) {
                config.headers['Authorization'] = `Bearer ${userToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;