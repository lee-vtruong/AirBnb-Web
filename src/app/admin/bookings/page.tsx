'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Popconfirm, DatePicker, InputNumber } from 'antd';
import type { TableProps } from 'antd';
import { DatPhongResponse } from '@/types/booking.types';
import datPhongService from '@/services/datPhongService';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

type BookingFormValues = {
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    soLuongKhach: number;
};

export default function ManageBookingsPage() {
    const [bookings, setBookings] = useState<DatPhongResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBooking, setEditingBooking] = useState<DatPhongResponse | null>(null);
    const [form] = Form.useForm();

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await datPhongService.getDatPhongAll();
            const content = response.data?.content || [];
            console.log('1. content bookings page', content); //1
            // Đảm bảo content luôn là array
            const bookingsArray = Array.isArray(content) ? content : [content];
            setBookings(bookingsArray);
        } catch {
            toast.error('Không thể tải danh sách đặt phòng.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const showModal = (booking: DatPhongResponse) => {
        setEditingBooking(booking);
        form.setFieldsValue({
            ...booking,
            dateRange: [dayjs(booking.ngayDen), dayjs(booking.ngayDi)],
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBooking(null);
        form.resetFields();
    };

    const onFinish = async (values: BookingFormValues) => {
        if (!editingBooking) return;

        try {
            const payload = {
                maPhong: editingBooking.maPhong,
                maNguoiDung: editingBooking.maNguoiDung,
                ngayDen: values.dateRange[0].toISOString(),
                ngayDi: values.dateRange[1].toISOString(),
                soLuongKhach: values.soLuongKhach,
            };

            await datPhongService.updateDatPhong(editingBooking.id, payload);
            toast.success('Cập nhật đặt phòng thành công!');
            fetchBookings();
            handleCancel();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { content?: string } } };
            toast.error(err.response?.data?.content || 'Cập nhật thất bại.');
        }
    };

    const handleDelete = async (bookingId: number) => {
        try {
            await datPhongService.deleteDatPhong(bookingId);
            toast.success('Xóa đặt phòng thành công!');
            fetchBookings();
        } catch {
            toast.error('Xóa đặt phòng thất bại.');
        }
    };

    const columns: TableProps<DatPhongResponse>['columns'] = [
        { title: 'ID Booking', dataIndex: 'id', key: 'id' },
        { title: 'Mã Phòng', dataIndex: 'maPhong', key: 'maPhong' },
        { title: 'Mã Người Dùng', dataIndex: 'maNguoiDung', key: 'maNguoiDung' },
        { title: 'Ngày Đến', dataIndex: 'ngayDen', key: 'ngayDen', render: (date) => dayjs(date).format('DD/MM/YYYY') },
        { title: 'Ngày Đi', dataIndex: 'ngayDi', key: 'ngayDi', render: (date) => dayjs(date).format('DD/MM/YYYY') },
        { title: 'Số Khách', dataIndex: 'soLuongKhach', key: 'soLuongKhach' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="space-x-2">
                    <Button onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Đặt phòng</h1>
            <Table
                dataSource={bookings}
                columns={columns}
                rowKey="id"
                loading={isLoading}
            />
            <Modal
                title="Sửa thông tin Đặt phòng"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
                    <Form.Item
                        name="dateRange"
                        label="Ngày đến - Ngày đi"
                        rules={[{ required: true }]}
                    >
                        <RangePicker className="w-full" />
                    </Form.Item>
                    <Form.Item
                        name="soLuongKhach"
                        label="Số lượng khách"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">
                        Lưu thay đổi
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}