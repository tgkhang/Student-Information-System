import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { UpdateTuitionDto } from './dto/update-tuition.dto';
import { CreateHocPhiDto } from './dto/create-tuition.dto';
import { HocPhi, HocPhiDocument } from 'src/schemas/HocPhi.schema';
import { GetListDto } from './dto/getList.dto';

@Injectable()
export class HocPhiService {
  constructor(
    @InjectModel(HocPhi.name) private hocphiModel: Model<HocPhiDocument>,
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
  ) {}

  async getTuitionByMSSV(mssv: string, query: GetListDto) {
    const sinhVien = await this.sinhVienModel.findOne({ mssv }).exec();
    if (!sinhVien) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }

    const { pageSize, pageNumber, sortBy, sortOrder } = query;

    if (!pageSize || !pageNumber || !sortBy || !sortOrder) {
      throw new BadRequestException('Thiếu các trường cần thiết');
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const tuition = await this.hocphiModel
      .find({
        SinhVienID: (sinhVien._id as Types.ObjectId).toString(),
      })
      .populate({ path: 'SinhVienID', model: 'SinhVien' })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    if (tuition.length === 0) {
      throw new NotFoundException('Sinh viên chưa có học phí nào');
    }

    return {
      pageSize,
      pageNumber,
      data: tuition,
    };
  }

  async getTuitionById(_id: string): Promise<HocPhi> {
    const Tuition = await this.hocphiModel
      .findById(new Types.ObjectId(_id))
      .populate({ path: 'SinhVienID', model: 'SinhVien' })
      .exec();
    if (!Tuition) {
      throw new NotFoundException('Học phí này không tồn tại');
    }
    return Tuition;
  }

  async addTuition(createHocPhiDto: CreateHocPhiDto) {
    const newTuition = new this.hocphiModel(createHocPhiDto);
    return await newTuition.save();
  }

  async updateTuition(
    id: string,
    updateTuitionDto: UpdateTuitionDto,
  ): Promise<{ message: string }> {
    const updatehocPhi = await this.hocphiModel.findByIdAndUpdate(
      id,
      updateTuitionDto,
      { new: true },
    );

    if (!updatehocPhi) {
      throw new NotFoundException('Học phí này không tồn tại');
    }
    return {
      message: 'Cập nhật thông tin học phí thành công',
    };
  }

  async deleteTuitionByMSSV(mssv: string): Promise<any> {
    const sinhVien = await this.sinhVienModel.findOne({ mssv });

    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên có MSSV: ${mssv}`);
    }

    const result = await this.hocphiModel
      .deleteMany({ SinhVienID: (sinhVien._id as Types.ObjectId).toString() })
      .exec();
    return result;
  }
}
