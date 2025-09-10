import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { KhoaHoc, KhoaHocDocument } from '../schemas/KhoaHoc.schema';
import { DiemDanh, DiemDanhDocument } from '../schemas/DiemDanh.schema';
import { GiangVien, GiangVienDocument } from 'src/schemas/GiangVien.schema';
import { UpdateAttendanceDto } from './dto/update-Attendance.dto';
import { CreateAttendanceDto } from './dto/create-Attendance.dto';
import { SinhVienStatusDto } from './dto/sinhvien-status.dto';

@Injectable()
export class DiemDanhService {
  constructor(
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
    @InjectModel(GiangVien.name)
    private giangVienModel: Model<GiangVienDocument>,
    @InjectModel(KhoaHoc.name) private khoaHocModel: Model<KhoaHocDocument>,
    @InjectModel(DiemDanh.name)
    private DiemDanhModel: Model<DiemDanhDocument>,
  ) {}

  async getAttendanceByKhoaHocAndMSSV(KhoaHocID: string, MA: string) {
    const MaGV = MA;
    const giangvien = await this.giangVienModel.findOne({ MaGV });

    if (!giangvien) {
      throw new NotFoundException(
        'Giảng viên không tồn tại trong khóa học này',
      );
    }
    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: KhoaHocID as unknown as Types.ObjectId })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }
    if (
      giangvien &&
      khoaHoc.GiangVienID.toString() !==
        (giangvien._id as Types.ObjectId).toString()
    ) {
      throw new UnauthorizedException('Giảng viên không thuộc khóa học này');
    }

    const attendance = await this.DiemDanhModel.find({ KhoaHocID })
      .populate({
        path: 'KhoaHocID',
        model: 'KhoaHoc',
      })
      .populate({
        path: 'DanhSachSinhVien.SinhVienID',
        model: 'SinhVien',
      })
      .exec();
    return attendance;
  }

  async getAttendanceById(_id: string): Promise<DiemDanh> {
    const Attendance = await this.DiemDanhModel.findById(
      _id as unknown as Types.ObjectId,
    )
      .populate({
        path: 'KhoaHocID',
        model: 'KhoaHoc',
      })
      .populate({
        path: 'DanhSachSinhVien.SinhVienID',
        model: 'SinhVien',
      })
      .exec();
    if (!Attendance) {
      throw new NotFoundException('Phiếu điểm danh tồn tại');
    }
    return Attendance;
  }

  async addAttendace(createAttendanceDto: CreateAttendanceDto, MaGV: string) {
    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: createAttendanceDto.KhoaHocID })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }
    const giangvienid = await this.giangVienModel.findOne({ MaGV });

    if (!giangvienid) {
      throw new NotFoundException(`Giảng viên không tồn tại`);
    }
    if (
      khoaHoc.GiangVienID.toString() !==
      (giangvienid._id as Types.ObjectId).toString()
    ) {
      throw new UnauthorizedException(
        'Chỉ giảng viên của khóa học này mới có thể điểm danh',
      );
    }

    const danhSachSinhVien = khoaHoc.SinhVienDangKy;

    if (!danhSachSinhVien || danhSachSinhVien.length === 0) {
      throw new NotFoundException('Không có sinh viên trong khóa học');
    }

    const DanhSachSinhVien = danhSachSinhVien.map((sinhVienID) => ({
      SinhVienID: sinhVienID,
      TrangThai: 'Absent',
    }));

    const newAttendace = new this.DiemDanhModel({
      ...createAttendanceDto,
      DanhSachSinhVien,
    });

    const savedAttendace = await newAttendace.save();

    return savedAttendace;
  }

  async updateAttendance(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
    MaGV: string,
  ): Promise<{ message: string }> {
    const DiemDanh = await this.DiemDanhModel.findById(
      new Types.ObjectId(id),
    ).exec();
    if (!DiemDanh) {
      throw new NotFoundException('Phiếu điểm danh không tồn tại');
    }
    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: DiemDanh.KhoaHocID })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }
    const giangvien = await this.giangVienModel.findOne({ MaGV });

    if (!giangvien) {
      throw new NotFoundException(`Giảng viên không tồn tại`);
    }
    if (
      giangvien &&
      khoaHoc.GiangVienID.toString() !==
        (giangvien._id as Types.ObjectId).toString()
    ) {
      throw new UnauthorizedException('Giảng viên không thuộc khóa học này');
    }
    const updateDiemDanh = await this.DiemDanhModel.findByIdAndUpdate(
      id,
      updateAttendanceDto,
      { new: true },
    );

    if (!updateDiemDanh) {
      throw new NotFoundException('Cập nhật phiếu điểm danh không thành công');
    }

    return {
      message: 'Cập nhật phiếu điểm danh thành công',
    };
  }

  async takeAttendance(
    id: string,
    SinhVienStatusDto: SinhVienStatusDto,
    MaGV: string,
  ): Promise<{ message: string }> {
    // Tìm phiếu điểm danh theo ID
    const DiemDanh = await this.DiemDanhModel.findById(id).exec();
    if (!DiemDanh) {
      throw new NotFoundException('Phiếu điểm danh không tồn tại');
    }

    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: DiemDanh.KhoaHocID })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }

    const giangvien = await this.giangVienModel.findOne({ MaGV }).exec();
    if (!giangvien) {
      throw new NotFoundException('Giảng viên không tồn tại');
    }
    if (
      giangvien &&
      khoaHoc.GiangVienID.toString() !==
        (giangvien._id as Types.ObjectId).toString()
    ) {
      throw new UnauthorizedException('Giảng viên không thuộc khóa học này');
    }

    const studentIndex = DiemDanh.DanhSachSinhVien.findIndex(
      (sv) =>
        sv.SinhVienID.toString() === SinhVienStatusDto.SinhVienID.toString(),
    );

    if (studentIndex === -1) {
      throw new NotFoundException(
        'Sinh viên không có trong danh sách điểm danh',
      );
    }

    DiemDanh.DanhSachSinhVien[studentIndex].TrangThai =
      SinhVienStatusDto.TrangThai;
    DiemDanh.DanhSachSinhVien[studentIndex].NgayCapNhat =
      SinhVienStatusDto.NgayCapNhat || new Date();

    const updatedDiemDanh = await DiemDanh.save();

    if (!updatedDiemDanh) {
      throw new NotFoundException('Cập nhật phiếu điểm danh không thành công');
    }

    return {
      message: 'Cập nhật phiếu điểm danh thành công',
    };
  }

  async deleteTestByMaKhoaHoc(MaKhoaHoc: string, _id: string): Promise<any> {
    const khoaHoc = await this.khoaHocModel.findOne({ MaKhoaHoc }).exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }

    const result = await this.DiemDanhModel.deleteOne(
      _id as unknown as Types.ObjectId,
    ).exec();
    return result;
  }
}
