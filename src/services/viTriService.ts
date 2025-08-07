import api from '@/lib/api';
import axios from 'axios';
import { ViTri } from '@/types/location.types';

interface ApiResponse<T> {
    content: T;
}

const viTriService = {
    getViTriAll: () => api.get<ApiResponse<ViTri[]>>('/api/vi-tri'),

    getViTriPhanTrang(page: number, pageSize: number, keyword: string = '') {
        return api.get(`/api/vi-tri/phan-trang-tim-kiem`, {
            params: {
                pageIndex: page,
                pageSize: pageSize,
                keyword: keyword
            }
        });
    },


    addViTri: (data: ViTri) => api.post('/api/vi-tri', data),

    updateViTri: (id: number, data: Partial<ViTri>) => api.put(`/api/vi-tri/${id}`, data),

    deleteViTri: (id: number) => api.delete(`/api/vi-tri/${id}`),

    uploadHinhViTri: (id: number, formData: FormData) =>
        api.post(`/api/vi-tri/upload-hinh/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),

};

export default viTriService;
