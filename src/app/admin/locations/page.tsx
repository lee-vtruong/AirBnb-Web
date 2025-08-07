'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Upload, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { ViTri } from '@/types/location.types';
import viTriService from '@/services/viTriService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type ViTriFormValues = {
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
};

type UploadFormValues = {
  hinhAnh: {
    originFileObj: File;
  }[];
};

export default function ManageLocationsPage() {
    const [locations, setLocations] = useState<ViTri[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [editingLocation, setEditingLocation] = useState<ViTri | null>(null);
    const [uploadingLocationId, setUploadingLocationId] = useState<number | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const [form] = Form.useForm();
    const [uploadForm] = Form.useForm();

    const fetchLocations = async (page = 1, pageSize = 10, keyword = '') => {
        setIsLoading(true);
        try {
            const response = await viTriService.getViTriPhanTrang(page, pageSize, keyword);
            const data = response.data.content;
            setLocations(data.data);
            setPagination({ current: data.pageIndex, pageSize: data.pageSize, total: data.totalRow });
        } catch {
            toast.error('Không thể tải danh sách vị trí.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleTableChange: TableProps<ViTri>['onChange'] = (paginationConfig) => {
        fetchLocations(paginationConfig.current, paginationConfig.pageSize, searchTerm);
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        fetchLocations(1, pagination.pageSize, value);
    };

    const showModal = (location: ViTri | null = null) => {
        setEditingLocation(location);
        form.setFieldsValue(location || {});
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingLocation(null);
        form.resetFields();
    };

    const onFinish = async (values: ViTriFormValues) => {
        try {
            if (editingLocation) {
                await viTriService.updateViTri(editingLocation.id, values);
                toast.success('Cập nhật vị trí thành công!');
            } else {
                await viTriService.addViTri({ ...values, id: 0 });
                toast.success('Thêm vị trí thành công!');
            }
            fetchLocations(pagination.current, pagination.pageSize, searchTerm);
            handleCancel();
        } catch (error: unknown) {
            const err = error as AxiosError<{ content: string }>;
            toast.error(err.response?.data?.content || 'Thao tác thất bại.');
        }
    };

    const handleDelete = async (locationId: number) => {
        try {
            await viTriService.deleteViTri(locationId);
            toast.success('Xóa vị trí thành công!');
            fetchLocations(pagination.current, pagination.pageSize, searchTerm);
        } catch {
            toast.error('Xóa vị trí thất bại.');
        }
    };

    const showUploadModal = (locationId: number) => {
        setUploadingLocationId(locationId);
        setIsUploadModalVisible(true);
    };

    const handleUpload = async (values: UploadFormValues) => {
        if (!uploadingLocationId || !values.hinhAnh || values.hinhAnh.length === 0) {
            toast.warn('Vui lòng chọn một file ảnh.');
            return;
        }
        const formData = new FormData();
        formData.append('formFile', values.hinhAnh[0].originFileObj);

        try {
            await viTriService.uploadHinhViTri(uploadingLocationId, formData);
            toast.success('Upload ảnh thành công!');
            fetchLocations(pagination.current, pagination.pageSize, searchTerm);
            setIsUploadModalVisible(false);
            uploadForm.resetFields();
        } catch {
            toast.error('Upload ảnh thất bại.');
        }
    };

    const columns: TableProps<ViTri>['columns'] = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên Vị Trí', dataIndex: 'tenViTri', key: 'tenViTri' },
        { title: 'Tỉnh Thành', dataIndex: 'tinhThanh', key: 'tinhThanh' },
        { title: 'Quốc Gia', dataIndex: 'quocGia', key: 'quocGia' },
        {
            title: 'Hình Ảnh', dataIndex: 'hinhAnh', key: 'hinhAnh',
            render: (hinhAnh, record) => (
                <div className="flex flex-col items-center">
                    {hinhAnh ? <Image src={hinhAnh} alt={record.tenViTri} width={80} height={60} style={{ objectFit: 'cover' }} /> : 'Chưa có ảnh'}
                    <Button size="small" type="link" onClick={() => showUploadModal(record.id)}>Chỉnh sửa</Button>
                </div>
            )
        },
        {
            title: 'Hành động', key: 'action', render: (_, record) => (
                <div className="space-x-2">
                    <Button onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)}><Button danger>Xóa</Button></Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Vị trí</h1>
                <Button type="primary" onClick={() => showModal()}>Thêm Vị trí</Button>
            </div>
            <Input.Search placeholder="Tìm kiếm theo tên vị trí, tỉnh thành..." onSearch={handleSearch} enterButton className="mb-6" />
            <Table dataSource={locations} columns={columns} rowKey="id" pagination={pagination} loading={isLoading} onChange={handleTableChange} />

            <Modal title={editingLocation ? "Sửa Vị trí" : "Thêm Vị trí mới"} open={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
                    <Form.Item name="tenViTri" label="Tên Vị trí" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="tinhThanh" label="Tỉnh Thành" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="quocGia" label="Quốc Gia" rules={[{ required: true }]}><Input /></Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Lưu</Button>
                </Form>
            </Modal>

            <Modal title="Upload ảnh cho vị trí" open={isUploadModalVisible} onCancel={() => setIsUploadModalVisible(false)} footer={null}>
                <Form form={uploadForm} onFinish={handleUpload} className="mt-4">
                    <Form.Item name="hinhAnh" label="Chọn ảnh" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList} rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}>
                        <Upload name="logo" listType="picture" beforeUpload={() => false}><Button icon={<UploadOutlined />}>Click to upload</Button></Upload>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Upload</Button>
                </Form>
            </Modal>
        </div>
    );
}