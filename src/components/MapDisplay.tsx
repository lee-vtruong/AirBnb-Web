'use client';

import { Phong } from "@/types/room.types";

// Đây là component giữ chỗ. Để hiển thị bản đồ thật, bạn cần tích hợp
// một thư viện như 'react-leaflet' hoặc '@react-google-maps/api'.
export default function MapDisplay({ rooms }: { rooms: Phong[] }) {
    return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Bản đồ sẽ hiển thị ở đây</p>
            {/* 
        Logic bản đồ thật sẽ như sau:
        <MapContainer center={[lat, lng]} zoom={13}>
          <TileLayer url="..." />
          {rooms.map(room => (
            <Marker key={room.id} position={[room.latitude, room.longitude]}>
              <Popup>{room.tenPhong}</Popup>
            </Marker>
          ))}
        </MapContainer>
      */}
        </div>
    );
}