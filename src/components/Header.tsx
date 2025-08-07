'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, loadUserFromStorage } from '@/redux/slices/authSlice';
import { useEffect, useState } from 'react';

export default function Header() {
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector(state => state.auth);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        dispatch(loadUserFromStorage());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link href="/" className="font-bold text-2xl text-rose-500">
                    airbnb
                </Link>
                <div className="flex items-center space-x-4">
                    {!isMounted ? (
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse" />
                            <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                    ) : currentUser ? (
                        <>
                            <Link href="/booking/history" className="text-gray-500 font-semibold hover:text-rose-500 cursor-pointer">
                                Chuyến đi
                            </Link>
                            <Link href="/profile" className="text-gray-500 font-semibold hover:text-rose-500">{currentUser.name}</Link>
                            <button onClick={handleLogout} className="text-gray-500 px-4 py-2 rounded-full font-semibold bg-gray-100 hover:text-rose-500">
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="px-4 py-2 rounded-full font-semibold hover:bg-gray-100">
                                Đăng nhập
                            </Link>
                            <Link href="/signup" className="px-4 py-2 rounded-full font-semibold text-white bg-rose-500 hover:bg-rose-600">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}