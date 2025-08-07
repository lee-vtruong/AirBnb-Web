import api from '@/lib/api';
import { DatPhongPayload } from '@/types/room.types';

interface DatPhongResponse {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
}

interface ApiResponse<T> {
  content: T;
}

const datPhongService = {
    getDatPhongAll: () => api.get<DatPhongResponse[]>('/api/dat-phong'),

    datPhong: (data: DatPhongPayload) => api.post<DatPhongResponse>('/api/dat-phong', data),

    getDatPhongById: (id: number) => api.get<DatPhongResponse>(`/api/dat-phong/${id}`),

    updateDatPhong: (id: number, data: Partial<DatPhongPayload>) => api.put<DatPhongResponse>(`/api/dat-phong/${id}`, data),

    deleteDatPhong: (id: number) => api.delete(`/api/dat-phong/${id}`),

    getDatPhongTheoNguoiDung: (maNguoiDung: number) =>
        api.get<ApiResponse<DatPhongResponse[]>>(`/api/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`),
};

export default datPhongService;