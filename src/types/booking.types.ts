export interface DatPhong {
    id: number;
    maPhong: number;
    ngayDen: string;
    ngayDi: string;
    soLuongKhach: number;
    maNguoiDung: number;
}

export interface DatPhongResponse {
  id: number;
  maPhong: number;
  ngayDen: string; 
  ngayDi: string; 
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface DatPhongApiResponse<T = DatPhongResponse | DatPhongResponse[]> {
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