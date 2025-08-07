'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import datPhongService from '@/services/datPhongService';
import BookingItem from '@/components/BookingItem';
import { DatPhongResponse } from '@/types/booking.types';
import Link from 'next/link';

export default function BookingHistoryPage() {
    const { currentUser } = useAppSelector((state) => state.auth);
    const [bookings, setBookings] = useState<DatPhongResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser) {
            const fetchBookings = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await datPhongService.getDatPhongTheoNguoiDung(currentUser.id);
                    if (response.data && response.data.content) {
                        const content = response.data.content;
                        const bookingsArray = Array.isArray(content) ? content : [content];
                        setBookings(bookingsArray);
                    }
                } catch (err) {
                    console.error('Failed to fetch bookings:', err);
                    setError('Không thể tải lịch sử đặt phòng. Vui lòng thử lại.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBookings();
        } else {
            setIsLoading(false);
        }
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Đang tải lịch sử đặt phòng...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
                <p className="mb-6">Bạn cần đăng nhập để xem lịch sử các chuyến đi của mình.</p>
                <Link href="/signin" className="px-6 py-3 rounded-lg font-semibold text-white bg-rose-500 hover:bg-rose-600">
                    Đăng nhập
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Lịch sử các chuyến đi</h1>
            {bookings.length > 0 ? (
                <div>
                    {bookings.map((booking) => (
                        <BookingItem key={booking.id} booking={booking} />
                    ))}
                </div>
            ) : (
                <p>Bạn chưa có chuyến đi nào.</p>
            )}
        </div>
    );
}