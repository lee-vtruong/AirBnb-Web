// app/phong/[id]/page.tsx
import phongService from '@/services/phongService';
import { Phong } from '@/types/room.types';
import BookingWidget from '@/components/BookingWidget';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

async function getRoomById(id: string): Promise<Phong | null> {
    try {
        console.log('Fetching room with ID:', id);
        const response = await phongService.getPhongById(id);
        console.log('Room detail response:', response.data);
        return response.data?.content || null;
    } catch (error) {
        console.error(`[API Error] Failed to fetch room ${id}:`, error);
        return null;
    }
}

export default async function RoomDetailPage({ params }: Props) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        console.log('Room ID from params:', id);

        const room = await getRoomById(id);

        if (!room) {
            notFound();
        }

        return (
            <div className="container mx-auto px-4 py-8">
                {/* Room Title */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{room.tenPhong}</h1>
                    <div className="flex items-center text-gray-600 text-sm">
                        <span>{room.khach} khách</span>
                        <span className="mx-2">•</span>
                        <span>{room.phongNgu} phòng ngủ</span>
                        <span className="mx-2">•</span>
                        <span>{room.giuong} giường</span>
                        <span className="mx-2">•</span>
                        <span>{room.phongTam} phòng tắm</span>
                    </div>
                </div>

                {/* Room Image */}
                <div className="mb-8">
                    <div className="aspect-video w-full relative rounded-xl overflow-hidden bg-gray-200">
                        {room.hinhAnh ? (
                            <Image
                                src={room.hinhAnh}
                                alt={room.tenPhong}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <p className="text-gray-500">Không có hình ảnh</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Room Info */}
                    <div className="lg:col-span-2">
                        <div className="border-b pb-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {room.moTa || 'Không có mô tả cho phòng này.'}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="border-b pb-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Tiện nghi</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {room.mayGiat && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">🧺</span>
                                        <span>Máy giặt</span>
                                    </div>
                                )}
                                {room.banLa && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">👔</span>
                                        <span>Bàn là</span>
                                    </div>
                                )}
                                {room.tivi && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">📺</span>
                                        <span>TV</span>
                                    </div>
                                )}
                                {room.dieuHoa && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">❄️</span>
                                        <span>Điều hòa</span>
                                    </div>
                                )}
                                {room.wifi && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">📶</span>
                                        <span>Wifi</span>
                                    </div>
                                )}
                                {room.bep && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">🍳</span>
                                        <span>Bếp</span>
                                    </div>
                                )}
                                {room.doXe && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">🚗</span>
                                        <span>Chỗ đỗ xe</span>
                                    </div>
                                )}
                                {room.hoBoi && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">🏊</span>
                                        <span>Hồ bơi</span>
                                    </div>
                                )}
                                {room.banUi && (
                                    <div className="flex items-center">
                                        <span className="w-6 h-6 mr-3">👔</span>
                                        <span>Bàn ủi</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BookingWidget room={room} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('[Room Detail Error]:', error);
        return (
            <div className="container mx-auto text-center py-20">
                <h1 className="text-2xl font-bold text-red-600">Đã có lỗi xảy ra</h1>
                <p>Không thể tải thông tin phòng. Vui lòng thử lại sau.</p>
            </div>
        );
    }
}