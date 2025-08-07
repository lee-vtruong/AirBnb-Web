'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, InputNumber, Checkbox, Upload, Image, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Phong } from '@/types/room.types';
import { ViTri } from '@/types/location.types';
import phongService from '@/services/phongService';
import viTriService from '@/services/viTriService';
import { toast } from 'react-toastify';

const { Option } = Select;

export default function ManageRoomsPage() {
    const [rooms, setRooms] = useState<Phong[]>([]);
    const [locations, setLocations] = useState<ViTri[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Phong | null>(null);
    const [uploadingRoomId, setUploadingRoomId] = useState<number | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const [form] = Form.useForm();
    const [uploadForm] = Form.useForm();

    const fetchRooms = async (page = 1, pageSize = 10, keyword = '') => {
        setIsLoading(true);
        try {
            const response = await phongService.getPhongPhanTrang(page, pageSize, keyword);
            const data = response.data.content;
            setRooms(data.data);
            setPagination({ current: data.pageIndex, pageSize: data.pageSize, total: data.totalRow });
        } catch {
            toast.error('Không thể tải danh sách phòng.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await viTriService.getViTriAll();
            // Giả sử API trả về { content: [...] }
            setLocations(response.data?.content || []);
        } catch {
            toast.error('Không thể tải danh sách vị trí.');
        }
    };

    useEffect(() => {
        fetchRooms();
        fetchLocations();
    }, []);

    const handleTableChange: TableProps<Phong>['onChange'] = (paginationConfig) => {
        fetchRooms(paginationConfig.current, paginationConfig.pageSize, searchTerm);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        fetchRooms(1, pagination.pageSize, value);
    };

    const showModal = (room: Phong | null = null) => {
        setEditingRoom(room);
        form.setFieldsValue(room || { wifi: false, dieuHoa: false, bep: false, doXe: false, hoBoi: false, banUi: false, mayGiat: false, banLa: false });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingRoom(null);
        form.resetFields();
    };

    const onFinish = async (values: any) => {
        try {
            if (editingRoom) {
                await phongService.updatePhong(editingRoom.id, values);
                toast.success('Cập nhật phòng thành công!');
            } else {
                await phongService.addPhong({ ...values, id: 0 });
                toast.success('Thêm phòng thành công!');
            }
            fetchRooms(pagination.current, pagination.pageSize, searchTerm);
            handleCancel();
        } catch (error: any) {
            toast.error(error.response?.data?.content || 'Thao tác thất bại.');
        }
    };

    const handleDelete = async (roomId: number) => {
        try {
            await phongService.deletePhong(roomId);
            toast.success('Xóa phòng thành công!');
            fetchRooms(pagination.current, pagination.pageSize, searchTerm);
        } catch {
            toast.error('Xóa phòng thất bại.');
        }
    };

    const showUploadModal = (roomId: number) => {
        setUploadingRoomId(roomId);
        setIsUploadModalVisible(true);
    };

    const handleUpload = async (values: any) => {
        if (!uploadingRoomId || !values.hinhAnh || values.hinhAnh.length === 0) {
            toast.warn('Vui lòng chọn một file ảnh.');
            return;
        }
        const formData = new FormData();
        formData.append('formFile', values.hinhAnh[0].originFileObj);

        try {
            await phongService.uploadHinhPhong(uploadingRoomId, formData);
            toast.success('Upload ảnh thành công!');
            fetchRooms(pagination.current, pagination.pageSize, searchTerm);
            setIsUploadModalVisible(false);
            uploadForm.resetFields();
        } catch {
            toast.error('Upload ảnh thất bại.');
        }
    };

    const columns: TableProps<Phong>['columns'] = [
        { title: 'Mã Phòng', dataIndex: 'id', key: 'id' },
        { title: 'Tên Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
        {
            title: 'Hình Ảnh', dataIndex: 'hinhAnh', key: 'hinhAnh',
            render: (hinhAnh, record) => (
                <div className="flex flex-col items-center">
                    {hinhAnh ? <Image src={hinhAnh} alt={record.tenPhong} width={80} height={60} style={{ objectFit: 'cover' }} /> : 'Chưa có ảnh'}
                    <Button size="small" type="link" onClick={() => showUploadModal(record.id)}>Chỉnh sửa</Button>
                </div>
            )
        },
        {
            title: 'Vị Trí', dataIndex: 'maViTri', key: 'maViTri',
            render: (maViTri) => locations.find(loc => loc.id === maViTri)?.tenViTri || 'Không xác định'
        },
        { title: 'Số khách tối đa', dataIndex: 'khach', key: 'khach' },
        {
            title: 'Hành động', key: 'action', render: (_, record) => (
                <Space>
                    <Button onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)}><Button danger>Xóa</Button></Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Phòng</h1>
                <Button type="primary" onClick={() => showModal()}>Thêm Phòng</Button>
            </div>
            <Input.Search
                placeholder="Nhập vào tên phòng để tìm kiếm"
                onSearch={handleSearch}
                enterButton
                className="mb-6"
            />
            <Table dataSource={rooms} columns={columns} rowKey="id" pagination={pagination} loading={isLoading} onChange={handleTableChange} />

            <Modal title={editingRoom ? "Sửa thông tin phòng" : "Thêm phòng mới"} open={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4 grid grid-cols-2 gap-x-4">
                    <Form.Item name="tenPhong" label="Tên phòng" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="khach" label="Số khách tối đa" rules={[{ required: true }]}><InputNumber min={1} className="w-full" /></Form.Item>
                    <Form.Item name="phongNgu" label="Số phòng ngủ" rules={[{ required: true }]}><InputNumber min={0} className="w-full" /></Form.Item>
                    <Form.Item name="giuong" label="Số giường" rules={[{ required: true }]}><InputNumber min={0} className="w-full" /></Form.Item>
                    <Form.Item name="phongTam" label="Số phòng tắm" rules={[{ required: true }]}><InputNumber min={0} className="w-full" /></Form.Item>
                    <Form.Item name="giaTien" label="Giá tiền / đêm" rules={[{ required: true }]}><InputNumber min={0} className="w-full" /></Form.Item>
                    <Form.Item name="maViTri" label="Vị trí" rules={[{ required: true }]}>
                        <Select placeholder="Chọn vị trí">
                            {/* ĐÃ SỬA LẠI Ở ĐÂY */}
                            {locations.map(loc => <Option key={loc.id} value={loc.id}>{loc.tenViTri}, {loc.tinhThanh}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô tả" className="col-span-2"><Input.TextArea rows={4} /></Form.Item>
                    <div className="col-span-2 grid grid-cols-4 gap-4">
                        <Form.Item name="mayGiat" valuePropName="checked"><Checkbox>Máy giặt</Checkbox></Form.Item>
                        <Form.Item name="banLa" valuePropName="checked"><Checkbox>Bàn là</Checkbox></Form.Item>
                        <Form.Item name="tivi" valuePropName="checked"><Checkbox>Tivi</Checkbox></Form.Item>
                        <Form.Item name="dieuHoa" valuePropName="checked"><Checkbox>Điều hòa</Checkbox></Form.Item>
                        <Form.Item name="wifi" valuePropName="checked"><Checkbox>Wifi</Checkbox></Form.Item>
                        <Form.Item name="bep" valuePropName="checked"><Checkbox>Bếp</Checkbox></Form.Item>
                        <Form.Item name="doXe" valuePropName="checked"><Checkbox>Đỗ xe</Checkbox></Form.Item>
                        <Form.Item name="hoBoi" valuePropName="checked"><Checkbox>Hồ bơi</Checkbox></Form.Item>
                        <Form.Item name="banUi" valuePropName="checked"><Checkbox>Bàn ủi</Checkbox></Form.Item>
                    </div>
                    <Form.Item className="col-span-2"><Button type="primary" htmlType="submit" className="w-full">Lưu</Button></Form.Item>
                </Form>
            </Modal>

            <Modal title="Upload ảnh cho phòng" open={isUploadModalVisible} onCancel={() => setIsUploadModalVisible(false)} footer={null}>
                <Form form={uploadForm} onFinish={handleUpload} className="mt-4">
                    <Form.Item name="hinhAnh" label="Chọn ảnh" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList} rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}>
                        <Upload name="logo" listType="picture" beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Upload</Button>
                </Form>
            </Modal>
        </div>
    );
}