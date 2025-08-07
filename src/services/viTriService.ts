import api from '@/lib/api';
import { ViTri } from '@/types/location.types';

interface ApiResponse<T> {
  content: T;
}

const viTriService = {
  getViTriAll: () => api.get<ApiResponse<ViTri[]>>('/api/vi-tri'),

  getViTriPhanTrang: (pageIndex = 1, pageSize = 8) =>
    api.get<ApiResponse<{ data: ViTri[] }>>(
      `/api/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}`
    ),
};

export default viTriService;