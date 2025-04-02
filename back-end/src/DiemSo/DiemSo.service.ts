import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { KhoaHoc, KhoaHocDocument } from '../schemas/KhoaHoc.schema';
import { DiemSo, DiemSoDocument } from '../schemas/DiemSo.schema';
import { GiangVien, GiangVienDocument } from 'src/schemas/GiangVien.schema';
import { UpdateScoreDto } from './dto/update-Score.dto';
import { CreateScoreDto } from './dto/create-Score.dto';

@Injectable()
export class DiemSoService {
  constructor(
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
    @InjectModel(GiangVien.name)
    private giangVienModel: Model<GiangVienDocument>,
    @InjectModel(KhoaHoc.name) private khoaHocModel: Model<KhoaHocDocument>,
    @InjectModel(DiemSo.name)
    private DiemSoModel: Model<DiemSoDocument>,
  ) {}

  async getListScoreByKhoaHocAndMSSV(KhoaHocID: string, mssv: string) {
    const sinhVien = await this.sinhVienModel.findOne({ mssv }).exec();
    if (!sinhVien) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }

    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: KhoaHocID as unknown as Types.ObjectId })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }

    const score = await this.DiemSoModel.find({ KhoaHocID })
      .populate({
        path: 'KhoaHocID',
        model: 'KhoaHoc',
      })
      .populate({
        path: 'SinhVienID',
        model: 'SinhVien',
      })
      .populate({
        path: 'DiemThanhPhan.BaiKiemTraID',
        model: 'BaiKiemTra',
      })
      .exec();

    return score;
  }

  async getListScorebyKhoaHocIDAndMaGV(KhoaHocID: string, magv: string) {
    const giangvien = await this.giangVienModel.findOne({ magv }).exec();
    if (!giangvien) {
      throw new NotFoundException('Giảng viên không tồn tại');
    }

    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: KhoaHocID as unknown as Types.ObjectId })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }
    if (
      khoaHoc.GiangVienID.toString() !==
      (giangvien._id as Types.ObjectId).toString()
    ) {
      throw new UnauthorizedException(
        'Giảng viên không phải là người dạy khóa học này',
      );
    }

    const score = await this.DiemSoModel.find({ KhoaHocID })
      .populate({
        path: 'KhoaHocID',
        model: 'KhoaHoc',
      })
      .populate({
        path: 'SinhVienID',
        model: 'SinhVien',
      })
      .populate({
        path: 'DiemThanhPhan.BaiKiemTraID',
        model: 'BaiKiemTra',
      })
      .exec();

    return score;
  }

  async getScoreById(_id: string): Promise<DiemSo> {
    const Test = await this.DiemSoModel.findById(
      _id as unknown as Types.ObjectId,
    )
      .populate({
        path: 'KhoaHocID',
        model: 'KhoaHoc',
      })
      .populate({
        path: 'SinhVienID',
        model: 'SinhVien',
      })
      .populate({
        path: 'DiemThanhPhan.BaiKiemTraID',
        model: 'BaiKiemTra',
      })
      .exec();
    if (!Test) {
      throw new NotFoundException('Điếm số của bài này không tồn tại');
    }
    return Test;
  }

  async updateScore(
    id: string,
    updateScoreDto: UpdateScoreDto,
    MaGV: string,
  ): Promise<{ message: string }> {
    const DiemSo = await this.DiemSoModel.findById(
      new Types.ObjectId(id),
    ).exec();
    if (!DiemSo) {
      throw new NotFoundException('Bài kiểm tra không tồn tại');
    }
    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: DiemSo.KhoaHocID })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }
    const giangvien = await this.giangVienModel.findOne({ MaGV });

    if (!giangvien) {
      throw new NotFoundException(`Giảng viên không dạy khóa học này`);
    }
    if (
      giangvien &&
      khoaHoc.GiangVienID.toString() !==
        (giangvien._id as Types.ObjectId).toString()
    ) {
      throw new UnauthorizedException('Giảng viên không thuộc khóa học này');
    }
    const updateDiemSo = await this.DiemSoModel.findByIdAndUpdate(
      id,
      updateScoreDto,
      { new: true },
    );

    if (!updateDiemSo) {
      throw new NotFoundException('Cập nhật bài kiểm tra không thành công');
    }

    return {
      message: 'Cập nhật bài kiểm tra thành công',
    };
  }

  async addScore(createScoreDto: CreateScoreDto, MaGV: string) {
    const khoaHoc = await this.khoaHocModel
      .findOne({ _id: createScoreDto.KhoaHocID })
      .exec();
    if (!khoaHoc) {
      throw new NotFoundException('Khóa học không tồn tại');
    }

    const isSinhVienInKhoaHoc = khoaHoc.SinhVienDangKy.some(
      (sinhVienID) =>
        sinhVienID.toString() === createScoreDto.SinhVienID.toString(),
    );
    if (!isSinhVienInKhoaHoc) {
      throw new UnauthorizedException('Sinh viên không thuộc khóa học này');
    }
    const giangvienid = await this.giangVienModel.findOne({ MaGV });

    if (!giangvienid) {
      throw new NotFoundException(`Giảng viên không tồn tại`);
    }
    if (
      khoaHoc.GiangVienID.toString() !==
      (giangvienid._id as Types.ObjectId).toString()
    ) {
      throw new UnauthorizedException('Giảng viên không dạy khóa học này');
    }

    const newScore = new this.DiemSoModel(createScoreDto);
    const savedScore = await newScore.save();
    return savedScore;
  }

  async deleteScoreByMaKhoaHoc(MaKhoaHoc: string): Promise<any> {
    const KhoaHoc = await this.khoaHocModel.findOne({ MaKhoaHoc });

    if (!KhoaHoc) {
      throw new NotFoundException(`Không tìm thấy khóa học tương ứng`);
    }

    const result = await this.DiemSoModel.deleteOne({
      KhoaHocID: (KhoaHoc._id as Types.ObjectId).toString(),
    }).exec();
    return result;
  }
}
