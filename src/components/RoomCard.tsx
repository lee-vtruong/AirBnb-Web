// components/RoomCard.tsx
import { Phong } from '@/types/room.types';
import Link from 'next/link';

interface RoomCardProps {
  phong: Phong;
}

export default function RoomCard({ phong }: RoomCardProps) {
  if (!phong) {
    return (
      <div className="border p-4 rounded-lg bg-red-50">
        <p className="text-red-600">Lỗi: Thông tin phòng không hợp lệ</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{phong.tenPhong || 'Tên phòng không có'}</h3>
      <div className="space-y-1">
        <p className="text-gray-600">
          Giá: <span className="font-medium">{phong.giaTien?.toLocaleString('vi-VN') || 'N/A'}₫/đêm</span>
        </p>
        <p className="text-sm text-gray-500">
          Khách: {phong.khach || 'N/A'} | 
          Phòng ngủ: {phong.phongNgu || 'N/A'} | 
          Giường: {phong.giuong || 'N/A'} | 
          Phòng tắm: {phong.phongTam || 'N/A'}
        </p>
        {phong.moTa && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{phong.moTa}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-500">ID: {phong.id}</p>
          <Link href={`/phong/${phong.id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}