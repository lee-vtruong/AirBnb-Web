'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { Layout, Menu, Button } from 'antd';
import { UserOutlined, VideoCameraOutlined, EnvironmentOutlined, BookOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Sider, Header, Content } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { currentUser } = useAppSelector(state => state.auth);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (currentUser === null) {
            // Tạm thời chờ Redux load từ storage
            return;
        }
        if (currentUser?.role !== 'ADMIN') {
            alert('Bạn không có quyền truy cập trang này!');
            router.push('/signin');
        }
    }, [currentUser, router]);

    if (currentUser?.role !== 'ADMIN') {
        return <div className="h-screen flex justify-center items-center">Kiểm tra quyền truy cập...</div>;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="text-white text-2xl text-center font-bold p-4">
                    {collapsed ? 'A' : 'Admin'}
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}><Link href="/admin/users">Quản lý User</Link></Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}><Link href="/admin/rooms">Quản lý Phòng</Link></Menu.Item>
                    <Menu.Item key="3" icon={<EnvironmentOutlined />}><Link href="/admin/locations">Quản lý Vị trí</Link></Menu.Item>
                    <Menu.Item key="4" icon={<BookOutlined />}><Link href="/admin/bookings">Quản lý Đặt phòng</Link></Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#fff' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: '#fff' }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}