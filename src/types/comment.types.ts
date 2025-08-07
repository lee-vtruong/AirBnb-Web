import { NguoiDung } from './user.types';

export interface BinhLuan {
    id: number;
    maPhong: number;
    maNguoiBinhLuan: number;
    ngayBinhLuan: string;
    noiDung: string;
    saoBinhLuan: number;
    avatar: string;
    tenNguoiBinhLuan: string;
}