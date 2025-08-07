'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DatPhongResponse } from '@/types/booking.types'; 
import phongService from '@/services/phongService';
import { Phong } from '@/types/room.types';

// Giả sử bạn tạo file types/booking.types.ts
// export interface DatPhongResponse {
//   id: number;
//   maPhong: number;
//   ngayDen: string;
//   ngayDi: string;
//   soLuongKhach: number;
//   maNguoiDung: number;
// }

export default function BookingItem({ booking }: { booking: DatPhongResponse }) {
    const [roomDetails, setRoomDetails] = useState<Phong | null>(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await phongService.getPhongById(booking.maPhong);
                if (response.data && response.data.content) {
                    setRoomDetails(response.data.content);
                }
            } catch (error) {
                console.error(`Failed to fetch details for room ${booking.maPhong}`, error);
            }
        };
        fetchRoomDetails();
    }, [booking.maPhong]);

    if (!roomDetails) {
        return <div className="border rounded-lg p-4 mb-4 animate-pulse h-32 bg-gray-200"></div>;
    }

    return (
        <div className="border rounded-lg p-4 mb-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48 h-32 relative rounded-md overflow-hidden">
                <Image
                    src={roomDetails.hinhAnh}
                    alt={roomDetails.tenPhong}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg">{roomDetails.tenPhong}</h3>
                <p className="text-sm text-gray-600">
                    Ngày đến: {new Date(booking.ngayDen).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-sm text-gray-600">
                    Ngày đi: {new Date(booking.ngayDi).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-sm text-gray-600">Số khách: {booking.soLuongKhach}</p>
                <div className="mt-2">
                    <Link href={`/phong/${roomDetails.id}`} className="text-rose-500 hover:underline font-semibold">
                        Xem chi tiết phòng
                    </Link>
                </div>
            </div>
        </div>
    );
}