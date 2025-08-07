import api from '@/lib/api';
import { Phong } from '@/types/room.types';


const phongService = {
    getPhongPhanTrang: (pageIndex = 1, pageSize = 10, keyword = '') =>
        api.get(`/api/phong-thue/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`),

    addPhong: (data: Omit<Phong, 'id'>) => api.post<Phong>('/api/phong-thue', data),

    updatePhong: (id: number, data: Partial<Phong>) => api.put<Phong>(`/api/phong-thue/${id}`, data),

    deletePhong: (id: number) => api.delete(`/api/phong-thue/${id}`),

    uploadHinhPhong: (maPhong: number, formData: FormData) =>
        api.post(`/api/phong-thue/upload-hinh-phong?maPhong=${maPhong}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getPhongThue: () => api.get<Phong[]>('/api/phong-thue'),
    getPhongTheoViTri: (maViTri: string) =>
        api.get<{ content: Phong[] }>(`/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${maViTri}`),
    getPhongById: (id: number) =>
        api.get<{ content: Phong }>(`/api/phong-thue/${id}`),
};

export default phongService;