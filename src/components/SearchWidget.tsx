'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import viTriService from '@/services/viTriService';
import { ViTri } from '@/types/location.types';

export default function SearchWidget() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState<ViTri[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<ViTri[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await viTriService.getViTriAll();
                if (response.data && response.data.content) {
                    setLocations(response.data.content);
                }
            } catch (error) {
                console.error('Failed to fetch locations:', error);
            }
        };
        fetchLocations();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = locations.filter(location =>
                `${location.tenViTri}, ${location.tinhThanh}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLocations(filtered);
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    }, [searchTerm, locations]);

    const handleLocationSelect = (location: ViTri) => {
        setSearchTerm(`${location.tenViTri}, ${location.tinhThanh}`);
        setSelectedLocationId(location.id);
        setIsDropdownOpen(false);
    };

    const handleSearch = () => {
        if (selectedLocationId) {
            router.push(`/phong-theo-vi-tri/${selectedLocationId}`);
        } else {
            alert('Vui lòng chọn một địa điểm từ danh sách.');
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);


    return (
        <div className="relative bg-white rounded-full p-2 shadow-lg max-w-xl mx-auto" ref={dropdownRef}>
            <div className="flex items-center">
                <input
                    type="text"
                    placeholder="Tìm kiếm điểm đến"
                    className="flex-grow bg-transparent px-6 py-2 outline-none text-black placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                />
                <button
                    onClick={handleSearch}
                    className="bg-rose-500 text-white rounded-full p-3 hover:bg-rose-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {isDropdownOpen && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl p-4 border max-h-80 overflow-y-auto">
                    <ul>
                        {filteredLocations.map(location => (
                            <li key={location.id}>
                                <button
                                    onClick={() => handleLocationSelect(location)}
                                    className="w-full text-left flex items-center p-3 rounded-xl hover:bg-gray-100 text-black placeholder:text-gray-500"
                                >
                                    <div className="mr-4 bg-gray-100 p-3 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.252l.001-.002a16.975 16.975 0 003.857-5.817l.001-.002A16.975 16.975 0 0012 2.25a16.975 16.975 0 00-6.58 10.04l-.001.002a16.975 16.975 0 003.857 5.817l.001.002a16.975 16.975 0 005.16 4.252zM12 14.25a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span>{location.tenViTri}, {location.tinhThanh}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}