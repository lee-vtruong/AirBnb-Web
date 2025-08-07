import api from '@/lib/api';
import { NguoiDung } from '@/types/user.types';

type UpdateNguoiDungPayload = Partial<NguoiDung>;
type AddNguoiDungPayload = Omit<NguoiDung, 'id' | 'avatar'> & { password: string };

interface ApiResponse<T> {
    content: T;
}

const nguoiDungService = {
    getUsersPhanTrang: (pageIndex = 1, pageSize = 10, keyword = '') =>
        api.get(`/api/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`),

    getUsers: () => api.get<ApiResponse<NguoiDung[]>>('/api/users'),

    getUserById: (id: number) => api.get<NguoiDung>(`/api/users/${id}`),

    addUser: (data: AddNguoiDungPayload) => api.post<NguoiDung>('/api/users', data),

    updateNguoiDung: (id: number, data: UpdateNguoiDungPayload) =>
        api.put<NguoiDung>(`/api/users/${id}`, data),

    deleteUser: (id: number) => api.delete(`/api/users?id=${id}`),

    searchUser: (tenNguoiDung: string) => api.get<NguoiDung[]>(`/api/users/search/${tenNguoiDung}`),

    uploadAvatar: (formData: FormData) => api.post('/api/users/upload-avatar', formData),
};

export default nguoiDungService;