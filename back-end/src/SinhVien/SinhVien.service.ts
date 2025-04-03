import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { CreateSinhVienDto } from './dto/create-sinhvien.dto';
import { UpdateSinhVienDto } from './dto/update-sinhvien.dto';
import { GetListStudentDto } from './dto/getList-sinhvien.dto';

@Injectable()
export class SinhVienService {
  constructor(
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
  ) {}

  async addStudent(createSinhVienDto: CreateSinhVienDto): Promise<SinhVien> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...sinhVienData } = createSinhVienDto;
    const newStudent = new this.sinhVienModel({
      ...sinhVienData,
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

    if (updateSinhVienDto.CCCD) {
      const existingCCCD = await this.sinhVienModel.findOne({
        CCCD: updateSinhVienDto.CCCD,
      });
      if (existingCCCD && existingCCCD.mssv !== mssv) {
        throw new BadRequestException('CCCD đã tồn tại');
      }
    }

    if (updateSinhVienDto.SoDienThoai) {
      const existingSDT = await this.sinhVienModel.findOne({
        SoDienThoai: updateSinhVienDto.SoDienThoai,
      });
      if (existingSDT && existingSDT.mssv !== mssv) {
        throw new BadRequestException('Số điện thoại đã tồn tại');
      }
    }

    delete updateSinhVienDto['mssv'];
    delete updateSinhVienDto['HoTen'];
    Object.assign(student, updateSinhVienDto, { ThoiGianCapNhat: new Date() });
    return student.save();
  }

  async deleteStudentByMSSV(mssv: string) {
    const student = await this.sinhVienModel.findOne({ mssv });

    if (!student) {
      throw new NotFoundException(`Không tìm thấy sinh viên có MSSV: ${mssv}`);
    }
    await this.sinhVienModel.deleteOne({ mssv });
  }
  async getStudentByMSSV(mssv: string): Promise<SinhVien> {
    const student = await this.sinhVienModel
      .findOne({ mssv })
      .populate('KhoaID', 'TenKhoa')
      .exec();
    if (!student) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }
    return student;
  }

  async searchSinhVien(query: string) {
    const sinhVien = await this.sinhVienModel.find({
      $or: [
        { HoTen: { $regex: query, $options: 'i' } },
        { mssv: { $regex: query, $options: 'i' } },
      ],
    });
    if (sinhVien.length === 0) {
      throw new NotFoundException('Không tìm thấy sinh viên.');
    }

    return sinhVien;
  }

  async getListStudent(query: GetListStudentDto) {
    const { pageSize, pageNumber, sortBy, sortOrder } = query;

    if (!pageSize || !pageNumber || !sortBy || !sortOrder) {
      throw new BadRequestException('Thiếu các trường cần thiết');
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const sinhViens = await this.sinhVienModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort(sort);

    return {
      pageSize,
      pageNumber,
      total: await this.sinhVienModel.countDocuments(),
      data: sinhViens,
    };
  }

  async addNotiToAll(thongBaoId: Types.ObjectId): Promise<void> {
    await this.sinhVienModel.updateMany(
      {},
      { $push: { ThongBao: { thongBaoId, isRead: false } } },
    );
  }

  async addNotiToKhoa(
    khoaId: Types.ObjectId,
    thongBaoId: Types.ObjectId,
  ): Promise<void> {
    await this.sinhVienModel.updateMany(
      { KhoaID: khoaId },
      { $push: { ThongBao: { thongBaoId, isRead: false } } },
    );
  }

  async addThongBaoToStudentsInKhoaHoc(
    studentIds: Types.ObjectId[],
    thongBaoId: Types.ObjectId,
  ): Promise<void> {
    await this.sinhVienModel.updateMany(
      { _id: { $in: studentIds } },
      { $push: { ThongBao: { thongBaoId, isRead: false } } },
    );
  }

  async removeNotiFromAll(thongBaoId: string): Promise<void> {
    await this.sinhVienModel.updateMany(
      {},
      { $pull: { ThongBao: { thongBaoId: new Types.ObjectId(thongBaoId) } } },
    );
  }

  async getStudentNoti(MSSV: string) {
    console.log(MSSV);
    const sinhVien = await this.sinhVienModel
      .findOne({ mssv: MSSV })
      .populate('ThongBao.thongBaoId')
      .exec();
    if (!sinhVien) {
      throw new NotFoundException('Không tìm thấy sinh viên.');
    }
    return sinhVien.ThongBao || [];
  }
}
