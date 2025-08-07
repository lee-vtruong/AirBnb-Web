// app/phong/[id]/not-found.tsx
import Link from 'next/link';

export default function RoomNotFound() {
  return (
    <div className="container mx-auto text-center py-20">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy phòng</h1>
        <p className="text-gray-600 mb-8">
          Phòng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </Link>
          <div>
            <Link 
              href="javascript:history.back()"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Quay lại trang trước
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}