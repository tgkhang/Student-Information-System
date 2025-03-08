import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { CreateSinhVienDto } from './dto/create-sinhvien.dto';
import { UpdateSinhVienDto } from './dto/update-sinhvien.dto';

@Injectable()
export class SinhVienService {
  constructor(
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
  ) {}

  async addStudent(createSinhVienDto: CreateSinhVienDto): Promise<SinhVien> {
    const newStudent = new this.sinhVienModel({
      ...createSinhVienDto,
      NgaySinh: null,
      GioiTinh: null,
      DiaChi: null,
      SoDienThoai: null,
      Khoa: null,
      CCCD: null,
      Anh: null,
      TrangThai: 'Studying',
    });
    return newStudent.save();
  }

  async updateStudent(
    mssv: string,
    updateSinhVienDto: UpdateSinhVienDto,
  ): Promise<SinhVien> {
    const student = await this.sinhVienModel.findOne({ mssv });
    if (!student) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }

    delete updateSinhVienDto['mssv'];
    delete updateSinhVienDto['HoTen'];

    Object.assign(student, updateSinhVienDto, { ThoiGianCapNhat: new Date() });
    return student.save();
  }
}
