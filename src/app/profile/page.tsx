'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { NguoiDung } from '@/types/user.types';
import { Phong } from '@/types/room.types';
import datPhongService from '@/services/datPhongService'; // Tạo service này
import nguoiDungService from '@/services/nguoiDungService'; // Tạo service này
import { Tabs, Form, Input, Button, DatePicker, Spin, Avatar } from 'antd';
import moment from 'moment';

const { TabPane } = Tabs;

export default function ProfilePage() {
    const { currentUser } = useAppSelector(state => state.auth);
    const [bookedRooms, setBookedRooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        if (currentUser) {
            // Cập nhật form với thông tin user
            form.setFieldsValue({
                ...currentUser,
                birthday: currentUser.birthday ? moment(currentUser.birthday) : null,
            });

            // Lấy danh sách phòng đã đặt
            datPhongService.getDatPhongTheoNguoiDung(currentUser.id)
                .then(res => {
                    setBookedRooms(res.data.content);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [currentUser, form]);

    const handleUpdateProfile = async (values: any) => {
        if (!currentUser) return;
        try {
            const updatedValues = {
                ...values,
                birthday: values.birthday.format('YYYY-MM-DD'),
            };
            await nguoiDungService.updateNguoiDung(currentUser.id, updatedValues);
            alert('Cập nhật thông tin thành công!');
            // Cần dispatch action để cập nhật lại Redux state
        } catch {
            alert('Cập nhật thất bại!');
        }
    };

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center"><Spin size="large" /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột trái: Thông tin cá nhân */}
                <div className="md:col-span-1 p-6 border rounded-xl shadow-lg">
                    <Avatar size={128} src={currentUser?.avatar} className="mx-auto block mb-4" />
                    <h2 className="text-2xl font-bold text-center">{currentUser?.name}</h2>
                    <p className="text-center text-gray-500">{currentUser?.email}</p>
                    <hr className="my-6" />
                    <h3 className="font-semibold mb-4">Chỉnh sửa thông tin</h3>
                    <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                        <Form.Item name="name" label="Tên"><Input /></Form.Item>
                        <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
                        <Form.Item name="birthday" label="Ngày sinh"><DatePicker className="w-full" /></Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">Cập nhật</Button>
                    </Form>
                </div>

                {/* Cột phải: Phòng đã thuê */}
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-bold mb-6">Phòng đã thuê</h2>
                    <div className="space-y-6">
                        {bookedRooms.length > 0 ? (
                            bookedRooms.map(booking => (
                                // Hiển thị card cho mỗi phòng đã đặt
                                <div key={booking.id} className="p-4 border rounded-lg">
                                    Phòng ID: {booking.maPhong} - Từ {booking.ngayDen} đến {booking.ngayDi}
                                </div>
                            ))
                        ) : (
                            <p>Bạn chưa đặt phòng nào.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}