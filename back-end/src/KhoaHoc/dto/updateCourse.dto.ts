import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    TenKhoaHoc?: string;

    @IsOptional()
    @IsString()
    GiangVienID?: Types.ObjectId;

    @IsOptional()
    @IsString()
    TroGiangID?: Types.ObjectId;

    @IsOptional()
    @IsInt()
    SoTinChi?: number;

    @IsOptional()
    @IsString()
    MoTa?: string;

    // @IsOptional()
    // @IsArray()
    // SinhVienDangKy?: Types.ObjectId[];

    // @IsOptional()
    // @IsArray()
    // TaiLieu?: Array<{ TenTaiLieu: string; LinkTaiLieu: string }>;

    // @IsOptional()
    // NgayCapNhat?: Date;
}
