// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-rose-500 transition-colors duration-300">
        {children}
    </a>
);

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 text-gray-700">
            <div className="container mx-auto px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="space-y-4">
                        <h3 className="font-bold tracking-wider uppercase">Giới thiệu</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-rose-500">Phương thức hoạt động của Airbnb</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Trang tin tức</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Nhà đầu tư</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Airbnb Plus</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Airbnb Luxe</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold tracking-wider uppercase">Cộng đồng</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-rose-500">Sự đa dạng và thuộc về</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Tiện nghi phù hợp cho người khuyết tật</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Đối tác liên kết Airbnb</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold tracking-wider uppercase">Đón tiếp khách</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-rose-500">Cho thuê nhà trên Airbnb</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">AirCover cho Chủ nhà</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Xem tài nguyên đón tiếp khách</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold tracking-wider uppercase">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-rose-500">Trung tâm trợ giúp</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Hỗ trợ khu dân cư</Link></li>
                            <li><Link href="#" className="hover:text-rose-500">Các tùy chọn hủy</Link></li>
                        </ul>
                    </div>

                </div>

                <hr className="my-8 border-gray-200" />

                <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
                    <p className="text-gray-500 text-center sm:text-left">
                        © {new Date().getFullYear()} Airbnb, Inc.
                        <span className="mx-2">·</span>
                        <Link href="#" className="hover:underline">Quyền riêng tư</Link>
                        <span className="mx-2">·</span>
                        <Link href="#" className="hover:underline">Điều khoản</Link>
                        <span className="mx-2">·</span>
                        <Link href="#" className="hover:underline">Sơ đồ trang web</Link>
                    </p>
                    <div className="flex mt-4 sm:mt-0 space-x-6">
                        <SocialIcon href="https://www.facebook.com">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                        </SocialIcon>
                        <SocialIcon href="https://www.twitter.com">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.791 4.649-.69.188-1.452.23-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                        </SocialIcon>
                        <SocialIcon href="https://www.instagram.com">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z" /></svg>
                        </SocialIcon>
                    </div>
                </div>
            </div>
        </footer>
    );
}