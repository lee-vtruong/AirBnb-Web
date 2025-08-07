// src/types/booking.types.ts
export interface DatPhongResponse {
  id: number;
  maPhong: number;
  ngayDen: string; 
  ngayDi: string; 
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface DatPhongApiResponse<T> {
  statusCode: number;
  content: T;
  dateTime: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  content: string;
  dateTime: string;
}

export interface DatPhongPayload {
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}