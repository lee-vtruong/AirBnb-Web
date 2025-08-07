import api from '@/lib/api';
import { BinhLuan } from '@/types/comment.types';

type PostBinhLuanPayload = Omit<BinhLuan, 'id' | 'avatar' | 'tenNguoiBinhLuan'>;

const binhLuanService = {
  getBinhLuanAll: () => api.get<BinhLuan[]>('/api/binh-luan'),

  getBinhLuanTheoPhong: (maPhong: number) => api.get<BinhLuan[]>(`/api/binh-luan/lay-binh-luan-theo-phong/${maPhong}`),

  postBinhLuan: (data: PostBinhLuanPayload) => api.post<BinhLuan>('/api/binh-luan', data),

  updateBinhLuan: (id: number, noiDung: string) => api.put<BinhLuan>(`/api/binh-luan/${id}`, { noiDung }),

  deleteBinhLuan: (id: number) => api.delete(`/api/binh-luan/${id}`),
};

export default binhLuanService;