"use client"; 

import { useState, useEffect } from 'react';

import viTriService from '@/services/viTriService';
import { ViTri } from '@/types/location.types';
import SearchWidget from '@/components/SearchWidget';
import Link from 'next/link';
import Image from 'next/image';

const InspirationCard = ({ src, title }: { src: string, title: string }) => (
  <div>
    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
      <img src={src} alt={title} className="w-full h-full object-cover" />
    </div>
    <h3 className="font-semibold text-lg mt-2">{title}</h3>
  </div>
);

export default function HomePage() {
  const [nearbyLocations, setNearbyLocations] = useState<ViTri[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await viTriService.getViTriPhanTrang(1, 8);
        const locationsData = response.data?.content?.data || [];
        setNearbyLocations(locationsData);
        console.log('9. Client-side fetch success:', locationsData);
      } catch (error) {
        console.error("Failed to fetch nearby locations on client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []); 

  if (isLoading) {
    return (
      <main>
        <div className="container mx-auto py-16 px-4">
          <section>
            <h2 className="text-4xl font-bold mb-8">Đang tải các điểm đến gần đây...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-center mb-6 border-b">
          <div className="flex space-x-8">
            <button className="py-4 border-b-2 border-black font-semibold">Nơi ở</button>
            <button className="py-4 text-gray-500">Trải nghiệm</button>
            <button className="py-4 text-gray-500">Trải nghiệm trực tuyến</button>
          </div>
        </div>
      </div>

      <div className="relative h-[500px] flex items-center justify-center text-white">
        <Image
          src="/hero-banner.jpg"
          alt="Hero Banner"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="relative z-10 w-full px-4 text-center">
          <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">
            Nhờ có Host, mọi điều đều có thể
          </h1>
          <SearchWidget />
        </div>
      </div>

      <div className="container mx-auto py-16 px-4">
        <section>
          <h2 className="text-4xl font-bold mb-8">Khám phá những điểm đến gần đây</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {nearbyLocations.length > 0 ? (
              nearbyLocations.map((viTri) => (
                <Link key={viTri.id} href={`/phong-theo-vi-tri/${viTri.id}`}>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      {viTri.hinhAnh && (
                        <Image
                          src={viTri.hinhAnh}
                          alt={viTri.tenViTri}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{viTri.tenViTri}</h3>
                      <p className="text-gray-500">{viTri.tinhThanh}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>Không tìm thấy địa điểm nào.</p>
            )}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-4xl font-bold mb-8">Ở bất cứ đâu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <InspirationCard src="/inspiration-1.jpg" title="Toàn bộ nhà" />
            <InspirationCard src="/inspiration-2.jpg" title="Chỗ ở độc đáo" />
            <InspirationCard src="/inspiration-3.jpg" title="Trang trại và thiên nhiên" />
            <InspirationCard src="/inspiration-4.jpg" title="Cho phép mang theo thú cưng" />
          </div>
        </section>
      </div>
    </main>
  );
}