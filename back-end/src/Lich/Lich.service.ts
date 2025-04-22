import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { KhoaHoc, KhoaHocDocument } from '../schemas/KhoaHoc.schema';
import { Lich, LichDocument } from '../schemas/Lich.schema';
import { CreateAndUpdateLichDto } from './dto/create&update-Lich.dto';
import { BaiKiemTra, BaiKiemTraDocument } from '../schemas/BaiKiemTra.schema';

@Injectable()
export class LichService {
  constructor(
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
    @InjectModel(KhoaHoc.name) private khoaHocModel: Model<KhoaHocDocument>,
    @InjectModel(Lich.name) private LichModel: Model<LichDocument>,
    @InjectModel(BaiKiemTra.name)
    private BaiKiemTraModel: Model<BaiKiemTraDocument>,
  ) {}

  async getcalendarByMSSV(mssv: string) {
    const sinhVien = await this.sinhVienModel.findOne({ mssv }).exec();
    if (!sinhVien) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }
    if (!sinhVien._id) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const sinhVienID = sinhVien._id.toString();

    const khoaHocs = await this.khoaHocModel
      .find({ SinhVienDangKy: { $in: [sinhVienID] } })
      .exec();

    const khoaHocIDs = khoaHocs.map((khoaHoc) => khoaHoc._id);
    const deadlines = khoaHocs.flatMap((khoaHoc) => khoaHoc.Deadlines);
    const baiKiemTras = await this.BaiKiemTraModel.find({
      KhoaHocID: { $in: khoaHocIDs },
    }).exec();

    const ghichu = await this.LichModel.findOne({ SinhVienID: sinhVienID }).exec();
    return {
      deadlines,
      baiKiemTras,
      ghichu,
      id: sinhVienID,
    };
  }

  async updatecalendar(
    id: string,
    updatecalendarDto: CreateAndUpdateLichDto,
  ): Promise<{ message: string }> {
    const ghichu = await this.LichModel.findOne({ SinhVienID: id }).exec();

    if (!ghichu) {
    const newLich = new this.LichModel(updatecalendarDto);
      await newLich.save();
    }
    if (ghichu) {
      ghichu.GhiChu = updatecalendarDto.GhiChu;
      await ghichu.save();
    }
    return {
      message: 'Cập nhật lịch thành công',
    };
  }

  async addcalendar(createcalendarDto: CreateAndUpdateLichDto) {
    const newcalendar = new this.LichModel(createcalendarDto);
    const savedcalendar = await newcalendar.save();
    return savedcalendar;
  }

  async deletecalendarByMSSV(mssv: string): Promise<any> {
    const sinhVien = await this.sinhVienModel.findOne({ mssv });

    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên có MSSV: ${mssv}`);
    }

    const result = await this.LichModel.deleteOne({
      SinhVienID: (sinhVien._id as Types.ObjectId).toString(),
    }).exec();
    return result;
  }
}
