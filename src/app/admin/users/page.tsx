'use client';
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, InputRef, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableProps, TableColumnType } from 'antd';
import { NguoiDung } from '@/types/user.types';
import nguoiDungService from '@/services/nguoiDungService';
import { toast } from 'react-toastify';
import Highlighter from 'react-highlight-words';
import { AxiosError } from 'axios';

const { Option } = Select;

type LocationFormValues = {
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
};

type UploadFormValues = {
    hinhAnh: {
        originFileObj: File;
    }[];
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState<NguoiDung[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<NguoiDung | null>(null);

    // State cho phân trang và tìm kiếm
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useState<InputRef>(null);

    const [form] = Form.useForm();

    // Hàm fetch dữ liệu với phân trang và tìm kiếm
    const fetchUsers = async (page = 1, pageSize = 10, keyword = '') => {
        setIsLoading(true);
        try {
            const response = await nguoiDungService.getUsersPhanTrang(page, pageSize, keyword);
            const data = response.data.content;
            setUsers(data.data);
            setPagination({
                current: data.pageIndex,
                pageSize: data.pageSize,
                total: data.totalRow,
            });
        } catch {
            toast.error('Không thể tải danh sách người dùng.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
    }, []);

    const handleTableChange: TableProps<NguoiDung>['onChange'] = (paginationConfig) => {
        fetchUsers(paginationConfig.current, paginationConfig.pageSize, searchText);
    };

    const handleSearch = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        fetchUsers(1, pagination.pageSize, selectedKeys[0]);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
        fetchUsers(1, pagination.pageSize);
    };

    const getColumnSearchProps = (dataIndex: keyof NguoiDung): TableColumnType<NguoiDung> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput.current}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)} icon={<SearchOutlined />} size="small">Tìm</Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small">Reset</Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase()),
        render: (text) => searchedColumn === dataIndex ? (
            <Highlighter highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ''} />
        ) : (text),
    });

    const showModal = (user: NguoiDung | null = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({ ...user, birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : null });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    const onFinish = async (values: LocationFormValues) => {
        const payload = { ...values, birthday: new Date(values.birthday).toISOString() };
        try {
            if (editingUser) {
                await nguoiDungService.updateNguoiDung(editingUser.id, payload);
                toast.success('Cập nhật người dùng thành công!');
            } else {
                // API yêu cầu id=0 và role
                const addUserPayload = { ...payload, id: 0, role: values.role || 'USER' };
                await nguoiDungService.addUser(addUserPayload);
                toast.success('Thêm người dùng thành công!');
            }
            fetchUsers(pagination.current, pagination.pageSize, searchText);
            handleCancel();
        } catch (error: unknown) {
            const err = error as AxiosError<{ content: string }>;
            toast.error(err.response?.data?.content || 'Thao tác thất bại.');
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            await nguoiDungService.deleteUser(userId);
            toast.success('Xóa người dùng thành công!');
            fetchUsers(pagination.current, pagination.pageSize, searchText);
        } catch {
            toast.error('Xóa người dùng thất bại.');
        }
    };

    const columns: TableProps<NguoiDung>['columns'] = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        { title: 'Tên', dataIndex: 'name', key: 'name', ...getColumnSearchProps('name') },
        { title: 'Email', dataIndex: 'email', key: 'email', ...getColumnSearchProps('email') },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role', filters: [{ text: 'ADMIN', value: 'ADMIN' }, { text: 'USER', value: 'USER' }], onFilter: (value, record) => record.role.indexOf(value as string) === 0 },
        {
            title: 'Hành động', key: 'action', render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)}><Button danger>Xóa</Button></Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
                <Button type="primary" onClick={() => showModal()}>Thêm Quản trị viên</Button>
            </div>
            <Table dataSource={users} columns={columns} rowKey="id" pagination={pagination} loading={isLoading} onChange={handleTableChange} />
            <Modal title={editingUser ? "Sửa thông tin User" : "Thêm User mới"} open={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                    {!editingUser && <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}><Input.Password /></Form.Item>}
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="birthday" label="Ngày sinh" rules={[{ required: true }]}><Input type="date" /></Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}><Select><Option value={true}>Nam</Option><Option value={false}>Nữ</Option></Select></Form.Item>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}><Select><Option value="ADMIN">ADMIN</Option><Option value="USER">USER</Option></Select></Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Lưu</Button>
                </Form>
            </Modal>
        </div>
    );
}