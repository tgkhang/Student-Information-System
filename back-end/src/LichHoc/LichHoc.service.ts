import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { KhoaHoc, KhoaHocDocument } from '../schemas/KhoaHoc.schema';
import { LichHoc, LichHocDocument } from '../schemas/LichHoc.schema';
import { GiangVien, GiangVienDocument } from 'src/schemas/GiangVien.schema';
import { UpdateScheduleDto } from './dto/update-Schedule.dto';
import { CreateScheduleDto } from './dto/create-Schedule.dto';

@Injectable()
export class LichHocService {
  constructor(
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
    @InjectModel(GiangVien.name)
    private giangVienModel: Model<GiangVienDocument>,
    @InjectModel(KhoaHoc.name) private khoaHocModel: Model<KhoaHocDocument>,
    @InjectModel(LichHoc.name) private lichHocModel: Model<LichHocDocument>,
  ) {}

  async getScheduleByMSSV(mssv: string) {
    const sinhVien = await this.sinhVienModel.findOne({ mssv }).exec();
    if (!sinhVien) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }

    const khoaHocs = await this.khoaHocModel
      .find({ SinhVienDangKy: { $in: [sinhVien._id] } })
      .exec();
    if (!khoaHocs || khoaHocs.length === 0) {
      throw new NotFoundException('Sinh viên chưa đăng ký khóa học nào');
    }

    const lichHocs = await this.lichHocModel
      .find({
        KhoaHocID: { $in: khoaHocs.map((khoaHoc) => khoaHoc._id) },
      })
      .exec();

    return lichHocs;
  }

  async getScheduleById(_id: string): Promise<LichHoc> {
    const schedule = await this.lichHocModel
      .findById(_id as unknown as Types.ObjectId)
      .exec();
    if (!schedule) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    return schedule;
  }

  async updateSchedule(
    id: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<{ message: string }> {
    const updateLichhoc = await this.lichHocModel.findByIdAndUpdate(
      id,
      updateScheduleDto,
      { new: true },
    );

    if (!updateLichhoc) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }

    return {
      message: 'Cập nhật kỷ luật thành công',
    };
  }

  async addSchedule(createScheduleDto: CreateScheduleDto) {
    const newSchedule = new this.lichHocModel(createScheduleDto);
    const savedSchedule = await newSchedule.save();
    return savedSchedule;
  }

  async deleteScheduleByMSSV(mssv: string): Promise<any> {
    const sinhVien = await this.sinhVienModel.findOne({ mssv });

    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên có MSSV: ${mssv}`);
    }

    const result = await this.lichHocModel
      .deleteOne({ SinhVienID: (sinhVien._id as Types.ObjectId).toString() })
      .exec();
    return result;
  }
}
