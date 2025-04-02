import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { KyLuat, KyLuatDocument } from '../schemas/KyLuat.schema';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { CreateDisciplineDto } from './dto/C&U-discipline.dto';
import { PhuHuynh, PhuHuynhDocument } from './../schemas/PhuHuynh.schema';
import { GetListDto } from './dto/getList.dto';

@Injectable()
export class KyLuatService {
  constructor(
    @InjectModel(KyLuat.name) private kyLuatModel: Model<KyLuatDocument>,
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
    @InjectModel(PhuHuynh.name) private phuHuynhModel: Model<PhuHuynhDocument>,
  ) {}

  async getDisciplineByMSSV(mssv: string) {
    const sinhVien = await this.sinhVienModel.findOne({ mssv });
    if (!sinhVien) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }
    const disciplines = await this.kyLuatModel
      .find({ SinhVienID: (sinhVien._id as Types.ObjectId).toString() })
      .populate({ path: 'SinhVienID', model: 'SinhVien' })
      .exec();

    return disciplines;
  }

  async addDiscipline(createDisciplineDto: CreateDisciplineDto) {
    const newDiscipline = new this.kyLuatModel(createDisciplineDto);
    const savedDiscipline = await newDiscipline.save();

    const sinhVienID = savedDiscipline.SinhVienID;

    const phuHuynh = await this.phuHuynhModel.findOne({
      SinhVienID: sinhVienID,
    });
    if (phuHuynh) {
      phuHuynh.ThongBao.push({
        KyLuatID: savedDiscipline._id as Types.ObjectId,
        PhuongThucGui: 'email',
      });

      await phuHuynh.save();
    }

    return savedDiscipline;
  }

  async updateDiscipline(
    id: string,
    createDisciplineDto: CreateDisciplineDto,
  ): Promise<{ message: string }> {
    const updatedDiscipline = await this.kyLuatModel.findByIdAndUpdate(
      id,
      createDisciplineDto,
      { new: true },
    );

    if (!updatedDiscipline) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }

    return {
      message: 'Cập nhật kỷ luật thành công',
    };
  }

  async getDisciplineById(_id: string): Promise<KyLuat> {
    const discipline = await this.kyLuatModel
      .findById(_id as unknown as Types.ObjectId)
      .populate({ path: 'SinhVienID', model: 'SinhVien' })
      .exec();
    if (!discipline) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    return discipline;
  }

  async getDisciplines(query: GetListDto) {
    const { pageSize, pageNumber, sortBy, sortOrder } = query;

    if (!pageSize || !pageNumber || !sortBy || !sortOrder) {
      throw new BadRequestException('Thiếu các trường cần thiết');
    }

    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const discipline = await this.kyLuatModel
      .find()
      .populate({ path: 'SinhVienID', model: 'SinhVien' })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    if (!discipline) {
      throw new NotFoundException(
        'Không tồn tại kỉ luật nào trong cơ sở dữ liệu',
      );
    }

    return {
      pageSize,
      pageNumber,
      data: discipline,
    };
  }

  async deleteDisciplineByMSSV(mssv: string): Promise<any> {
    const sinhVien = await this.sinhVienModel.findOne({ mssv });

    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên có MSSV: ${mssv}`);
    }

    const result = await this.kyLuatModel
      .deleteMany({ SinhVienID: (sinhVien._id as Types.ObjectId).toString() })
      .exec();
    return result;
  }
}
