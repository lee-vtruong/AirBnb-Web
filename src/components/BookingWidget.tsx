// src/components/BookingWidget.tsx (hoặc đường dẫn tương tự)

"use client";
import { Phong } from '@/types/room.types';
import { DatPhongResponse, ApiErrorResponse } from '@/types/booking.types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/configStore';
import datPhongService from '@/services/datPhongService';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';

interface BookingWidgetProps {
    room: Phong | null | undefined;
}

export default function BookingWidget({ room }: BookingWidgetProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [checkIn, setCheckIn] = useState<dayjs.Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<dayjs.Dayjs | null>(null);
    const [guests, setGuests] = useState(1);
    const [isMounted, setIsMounted] = useState(false);
    const [bookedDates, setBookedDates] = useState<string[]>([]);

    const user = useSelector((state: RootState) => state.auth.currentUser);
    const isLoggedIn = !!user;

    useEffect(() => {
        setIsMounted(true);
        if (room?.id) {
            const fetchBookedDates = async () => {
                try {
                    console.log('Bắt đầu lấy lịch đặt phòng cho phòng:', room.id);

                    const response = await datPhongService.getDatPhongAll();
                    const allBookings = response.data?.content || [];

                    if (!Array.isArray(allBookings)) {
                        console.error("API không trả về một mảng đặt phòng:", allBookings);
                        throw new Error("Dữ liệu trả về không hợp lệ.");
                    }

                    const roomBookings = allBookings.filter(
                        (booking: DatPhongResponse) => booking.maPhong === room.id
                    );

                    console.log('Các lượt đặt phòng của phòng này:', roomBookings);

                    const disabledDatesSet = new Set<string>();
                    roomBookings.forEach((booking: DatPhongResponse) => {
                        if (booking && booking.ngayDen && booking.ngayDi) {
                            let currentDate = dayjs(booking.ngayDen);
                            const endDate = dayjs(booking.ngayDi);

                            // Vô hiệu hóa tất cả các ngày từ ngày đến đến ngày đi
                            while (currentDate.isBefore(endDate, 'day')) {
                                disabledDatesSet.add(currentDate.format('YYYY-MM-DD'));
                                currentDate = currentDate.add(1, 'day');
                            }
                        }
                    });

                    const disabledDatesArray = Array.from(disabledDatesSet);
                    console.log('Các ngày bị vô hiệu hóa:', disabledDatesArray);
                    setBookedDates(disabledDatesArray);

                } catch (error) {
                    console.error("Lỗi khi lấy lịch đặt phòng:", error);

                    if (error instanceof AxiosError) {
                        console.error("Chi tiết lỗi API:", error.response?.data);
                    }

                    // Hiển thị lỗi cho người dùng
                    toast.error("Không thể tải được lịch đặt phòng. Vui lòng thử lại.");

                    // Quan trọng: vẫn set mảng rỗng để không làm crash app, nhưng bây giờ lỗi là thật
                    setBookedDates([]);
                }
            };

            fetchBookedDates();
        }
    }, [room?.id]);

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Vô hiệu hóa ngày trong quá khứ
        if (current && current < dayjs().startOf('day')) {
            return true;
        }

        // Vô hiệu hóa những ngày đã được đặt
        if (bookedDates.includes(current.format('YYYY-MM-DD'))) {
            return true;
        }

        return false;
    };

    if (!room) {
        return <div className="border p-4 rounded-2xl shadow"><p>Không có thông tin phòng để đặt.</p></div>;
    }

    const totalNights = checkIn && checkOut ? checkOut.diff(checkIn, 'day') : 0;
    const totalAmount = totalNights > 0 ? totalNights * room.giaTien : 0;

    const handleBooking = async () => {
        if (!isLoggedIn) {
            router.push('/signin');
            return;
        }

        if (!checkIn || !checkOut) {
            toast.warn('Vui lòng chọn ngày nhận và trả phòng');
            return;
        }

        if (totalNights <= 0) {
            toast.warn('Ngày trả phòng phải sau ngày nhận phòng');
            return;
        }

        if (guests > (room.khach || 1)) {
            toast.warn(`Phòng chỉ cho phép tối đa ${room.khach} khách`);
            return;
        }

        // Kiểm tra xung đột một lần nữa trước khi gửi
        // Logic này bây giờ sẽ hoạt động chính xác vì `bookedDates` đã có dữ liệu đúng
        let currentDate = checkIn.clone();
        while (currentDate.isBefore(checkOut, 'day')) {
            if (bookedDates.includes(currentDate.format('YYYY-MM-DD'))) {
                toast.error('Ngày bạn chọn đã có người đặt. Vui lòng làm mới trang và chọn lại ngày khác.');
                return;
            }
            currentDate = currentDate.add(1, 'day');
        }

        setIsLoading(true);
        try {
            const bookingPayload = {
                maPhong: room.id,
                ngayDen: checkIn.toISOString(),
                ngayDi: checkOut.toISOString(),
                soLuongKhach: guests,
                maNguoiDung: user.id,
            };

            await datPhongService.datPhong(bookingPayload);

            toast.success('Đặt phòng thành công!');
            router.push('/profile');

        } catch (error: unknown) {
            console.error('Lỗi khi đặt phòng:', error);
            const err = error as AxiosError<ApiErrorResponse>;
            const errorMessage = err.response?.data?.content || 'Có lỗi xảy ra khi đặt phòng, vui lòng thử lại sau!';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) {
        return (
            <div className="border p-6 rounded-2xl shadow-lg space-y-4 animate-pulse">
                <div className="h-8 w-3/4 bg-gray-200 rounded mx-auto"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-12 w-full bg-gray-300 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="border p-6 rounded-2xl shadow-lg space-y-4">
            <div className="text-center border-b pb-4">
                <h3 className="text-2xl font-bold">{room.giaTien?.toLocaleString('vi-VN')}₫</h3>
                <p className="text-gray-600">mỗi đêm</p>
            </div>

            <div className="space-y-3">
                <DatePicker.RangePicker
                    className="w-full !py-3"
                    placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                    onChange={(dates) => {
                        setCheckIn(dates ? dates[0] : null);
                        setCheckOut(dates ? dates[1] : null);
                    }}
                    disabledDate={disabledDate}
                    format="DD/MM/YYYY"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số khách (tối đa {room.khach})
                    </label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    >
                        {Array.from({ length: room.khach || 1 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>{num} khách</option>
                        ))}
                    </select>
                </div>
            </div>

            {totalAmount > 0 && (
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{room.giaTien?.toLocaleString('vi-VN')}₫ x {totalNights} đêm</span>
                        <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Tổng cộng</span>
                        <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>
            )}

            <button
                className={`w-full py-3 font-semibold rounded-xl shadow-md transition-all ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isLoggedIn
                        ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                onClick={handleBooking}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                    </div>
                ) : isLoggedIn ? (
                    'Đặt ngay'
                ) : (
                    'Đăng nhập để đặt phòng'
                )}
            </button>

            {!isLoggedIn && (
                <p className="text-xs text-gray-500 text-center">Bạn cần đăng nhập để có thể đặt phòng</p>
            )}
            <p className="text-xs text-gray-500 text-center">Bạn vẫn chưa bị trừ tiền</p>
        </div>
    );
}