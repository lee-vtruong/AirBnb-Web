"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BookingSuccessPage() {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto redirect sau 10 giây
                    window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-green-100 p-3">
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            🎉 Đặt phòng thành công!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Cảm ơn bạn đã đặt phòng. Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
                        </p>
                    </div>

                    {/* Booking Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Thông tin đặt phòng:</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mã đặt phòng:</span>
                                <span className="font-medium">#BK{Date.now().toString().slice(-6)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Trạng thái:</span>
                                <span className="text-green-600 font-medium">Đã xác nhận</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Thời gian đặt:</span>
                                <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Bước tiếp theo:
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Kiểm tra email xác nhận trong hòm thư của bạn</li>
                                    <li>Lưu lại mã đặt phòng để tra cứu</li>
                                    <li>Liên hệ với chủ nhà nếu cần hỗ trợ</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/booking/history"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                        >
                            Xem lịch sử đặt phòng
                        </Link>
                        
                        <Link
                            href="/"
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                        >
                            Về trang chủ
                        </Link>
                    </div>

                    {/* Auto redirect notice */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Sẽ tự động chuyển về trang chủ sau {countdown} giây
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Support */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Cần hỗ trợ?{' '}
                        <Link href="/contact" className="font-medium text-pink-600 hover:text-pink-500">
                            Liên hệ với chúng tôi
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}