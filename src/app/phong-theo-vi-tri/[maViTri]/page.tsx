// app/phong-theo-vi-tri/[maViTri]/page.tsx
import phongService from '@/services/phongService';
import { Phong } from '@/types/room.types';
import RoomCard from '@/components/RoomCard';
import MapDisplay from '@/components/MapDisplay';

interface Props {
  params: Promise<{
    maViTri: string;
  }>;
}

async function getRoomsByLocation(maViTri: string): Promise<Phong[]> {
  try {
    const response = await phongService.getPhongTheoViTri(maViTri);
    return response.data || null;
  } catch (error) {
    console.error(`[API Error] Failed to fetch rooms for location ${maViTri}:`, error);
    return [];
  }
}

export default async function RoomsByLocationPage({ params }: Props) {
  try {
    const resolvedParams = await params;
    console.log("params nhận được:", params);
    console.log("resolvedParams:", resolvedParams);
    const { maViTri } = resolvedParams;

    const rooms = await getRoomsByLocation(maViTri);
    const locationName = rooms.length > 0 ? rooms[0].tenPhong.split(' ')[0] : "khu vực đã chọn";

    return (
      <div className="flex h-screen">
        <div className="w-full lg:w-3/5 xl:w-7/12 p-6 overflow-y-auto">
          <div className="mb-6">
            <p className="text-sm">{rooms.length > 0 ? `${rooms.length}+ chỗ ở` : '0 chỗ ở'}</p>
            <h1 className="text-3xl font-bold mt-1">Chỗ ở tại {locationName}</h1>
            <div className="flex space-x-3 mt-4 border-b pb-4">
              <button className="px-4 py-2 border rounded-full text-sm hover:border-black">Loại nơi ở</button>
              <button className="px-4 py-2 border rounded-full text-sm hover:border-black">Giá</button>
              <button className="px-4 py-2 border rounded-full text-sm hover:border-black">Đặt ngay</button>
              <button className="px-4 py-2 border rounded-full text-sm hover:border-black">Phòng và phòng ngủ</button>
            </div>
          </div>
          {rooms.length > 0 ? (
            <div>
              {rooms.map((phong) => (
                <RoomCard key={phong.id} phong={phong} />
              ))}
            </div>
          ) : (
            <p>Không tìm thấy phòng nào tại vị trí này.</p>
          )}
        </div>
        <div className="hidden lg:block lg:w-2/5 xl:w-5/12">
          <div className="sticky top-0 h-screen">
            <MapDisplay rooms={rooms} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("[Page Render Error] An error occurred in RoomsByLocationPage:", error);
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl font-bold">Đã có lỗi xảy ra</h1>
        <p>Không thể tải danh sách phòng. Vui lòng thử lại sau.</p>
      </div>
    );
  }
}