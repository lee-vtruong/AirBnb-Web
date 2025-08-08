'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginSuccess } from '@/redux/slices/authSlice';
import authService from '@/services/authService';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
// import { SignInResponse } from '@/types/auth.types';

export default function SignInPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'ADMIN') {
                router.replace('/admin/users');
            } else {
                router.replace('/');
            }
        }
    }, [currentUser, router]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            // email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
            password: Yup.string().required('Mật khẩu là bắt buộc'),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const response = await authService.signIn(values);
                console.log('8. Sign-in response:', response.data); // 8

                if (response.data && response.data.content) {
                    const { user, token } = response.data.content;

                    dispatch(loginSuccess({ user, token }));
                    toast.success('Đăng nhập thành công!');

                    if (user.role === 'ADMIN') {
                        router.push('/admin/users');
                    } else {
                        const pendingBooking = localStorage.getItem('pendingBooking');
                        if (pendingBooking) {
                            const bookingData = JSON.parse(pendingBooking);
                            localStorage.removeItem('pendingBooking');
                            router.push(bookingData.returnUrl || '/');
                        } else {
                            router.push('/');
                        }
                    }
                } else {
                    throw new Error('Dữ liệu trả về không hợp lệ');
                }
            } catch (error: unknown) {
                const err = error as AxiosError<{ content: string }>;
                toast.error(err.response?.data?.content || 'Email hoặc mật khẩu không đúng.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    if (typeof window !== 'undefined' && localStorage.getItem('accessToken') && !currentUser) {
        return <div>Đang xác thực...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-rose-500">Đăng nhập</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...formik.getFieldProps('email')}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            {...formik.getFieldProps('password')}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:bg-rose-300"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link href="/signup" className="font-medium text-rose-500 hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}