import api from '@/lib/api';
import { DatPhongResponse, DatPhongApiResponse, DatPhongPayload } from '@/types/booking.types';

const TOKEN_CYBERSOFT = process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTEiLCJIZXRIYW5TdHJpbmciOiIxNC8wMi8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzEwMjcyMDAwMDAiLCJuYmYiOjE3NTE5OTc2MDAsImV4cCI6MTc3MTE3ODQwMH0.JG5__XHVipsXW58_ZhijRt1DzTA4UD1j1lcvaZPd9mo';

const datPhongService = {
    getDatPhongAll: () =>
        api.get<DatPhongApiResponse>('/api/dat-phong', {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),

    // FIX: Sửa từ single quotes thành backticks để template literal hoạt động
    getDatPhongByMaPhong: (maPhong: number) =>
        api.get<DatPhongApiResponse>(`/api/dat-phong/lay-dat-phong-theo-phong?maPhong=${maPhong}`, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),

    datPhong: (data: DatPhongPayload) =>
        api.post<DatPhongApiResponse>('/api/dat-phong', data, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),

    getDatPhongById: (id: number) =>
        api.get<DatPhongApiResponse>(`/api/dat-phong/${id}`, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),

    updateDatPhong: (id: number, data: Partial<DatPhongPayload>) =>
        api.put<DatPhongApiResponse>(`/api/dat-phong/${id}`, data, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),

    deleteDatPhong: (id: number) =>
        api.delete<DatPhongApiResponse>(`/api/dat-phong/${id}`, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),

    getDatPhongTheoNguoiDung: (maNguoiDung: number) =>
        api.get<DatPhongApiResponse>(`/api/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                tokenCybersoft: TOKEN_CYBERSOFT,
            },
        }),
};

export default datPhongService;