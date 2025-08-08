'use client';
import { useEffect, useRef, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TableProps, TableColumnType, InputRef } from 'antd';
import { NguoiDung } from '@/types/user.types';
import nguoiDungService from '@/services/nguoiDungService';
import { toast } from 'react-toastify';
import Highlighter from 'react-highlight-words';
import { AxiosError } from 'axios';

const { Option } = Select;

// Define form values type
type UserFormValues = {
    name: string;
    email: string;
    password?: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: 'ADMIN' | 'USER';
};

// Define payload type for adding a user
type AddNguoiDungPayload = {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: 'ADMIN' | 'USER';
};

// Define payload type for updating a user
type UpdateNguoiDungPayload = Omit<AddNguoiDungPayload, 'password'> & { password?: string };

export default function ManageUsersPage() {
    const [users, setUsers] = useState<NguoiDung[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<NguoiDung | null>(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef | null>(null);
    const [form] = Form.useForm();

    // Fetch users with pagination and search
    const fetchUsers = async (page = 1, pageSize = 10, keyword = '') => {
        setIsLoading(true);
        try {
            const response = await nguoiDungService.getUsersPhanTrang(page, pageSize, keyword);
            const data = response.data.content;
            console.log('4. Fetched users:', data); // 4
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
                    ref={searchInput}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                    >
                        Tìm
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small">
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase()),
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const showModal = (user: NguoiDung | null = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({ ...user, birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '' });
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

    const onFinish = async (values: UserFormValues) => {
        const payload = { ...values, birthday: new Date(values.birthday).toISOString() };
        try {
            if (editingUser) {
                const updatePayload: UpdateNguoiDungPayload = { ...payload, id: editingUser.id };
                await nguoiDungService.updateNguoiDung(editingUser.id, updatePayload);
                toast.success('Cập nhật người dùng thành công!');
            } else {
                if (!values.password) {
                    toast.error('Mật khẩu là bắt buộc khi thêm người dùng.');
                    return;
                }
                const addUserPayload: AddNguoiDungPayload = { ...payload, id: 0, password: values.password };
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
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'ADMIN', value: 'ADMIN' },
                { text: 'USER', value: 'USER' },
            ],
            onFilter: (value, record) => record.role.indexOf(value as string) === 0,
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => showModal(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
                <Button type="primary" onClick={() => showModal()}>
                    Thêm Quản trị viên
                </Button>
            </div>
            <Table
                dataSource={users}
                columns={columns}
                rowKey="id"
                pagination={pagination}
                loading={isLoading}
                onChange={handleTableChange}
            />
            <Modal
                title={editingUser ? 'Sửa thông tin User' : 'Thêm User mới'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
                    <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
                        <Input />
                    </Form.Item>
                    {!editingUser && (
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="birthday" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                        <Select>
                            <Option value={true}>Nam</Option>
                            <Option value={false}>Nữ</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}>
                        <Select>
                            <Option value="ADMIN">ADMIN</Option>
                            <Option value="USER">USER</Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">
                        Lưu
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}