'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            birthday: '',
            gender: true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên là bắt buộc'),
            email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
            password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
            phone: Yup.string().matches(/^[0-9]+$/, "Số điện thoại không hợp lệ").required('Số điện thoại là bắt buộc'),
            birthday: Yup.string().required('Ngày sinh là bắt buộc'),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                const payload = {
                    ...values,
                    id: 0,
                    role: 'USER' 
                };
                await authService.signUp(values);
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                router.push('/signin');
            } catch (error: unknown) {
                const err = error as AxiosError<{ content: string }>;
                toast.error(err.response?.data?.content || 'Đăng ký thất bại, email hoặc SĐT có thể đã tồn tại.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-rose-500">Tạo tài khoản</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input id="name" type="text" {...formik.getFieldProps('name')} className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-rose-500 focus:border-rose-500" />
                        {formik.touched.name && formik.errors.name ? <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div> : null}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" type="text" {...formik.getFieldProps('email')} className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-rose-500 focus:border-rose-500" />
                        {formik.touched.email && formik.errors.email ? <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div> : null}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input id="password" type="password" {...formik.getFieldProps('password')} className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-rose-500 focus:border-rose-500" />
                        {formik.touched.password && formik.errors.password ? <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div> : null}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input id="phone" type="tel" {...formik.getFieldProps('phone')} className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-rose-500 focus:border-rose-500" />
                        {formik.touched.phone && formik.errors.phone ? <div className="text-red-600 text-sm mt-1">{formik.errors.phone}</div> : null}
                    </div>

                    <div>
                        <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                        <input id="birthday" type="date" {...formik.getFieldProps('birthday')} className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-rose-500 focus:border-rose-500" />
                        {formik.touched.birthday && formik.errors.birthday ? <div className="text-red-600 text-sm mt-1">{formik.errors.birthday}</div> : null}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input type="radio" {...formik.getFieldProps('gender')} value="true" checked={formik.values.gender === true} className="text-rose-500 focus:ring-rose-500" />
                                <span className="ml-2">Nam</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" {...formik.getFieldProps('gender')} value="false" checked={formik.values.gender === false} className="text-rose-500 focus:ring-rose-500" />
                                <span className="ml-2">Nữ</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:bg-rose-300"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link href="/signin" className="font-medium text-rose-500 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}