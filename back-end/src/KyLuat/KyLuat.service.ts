import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KyLuat, KyLuatDocument } from '../schemas/KyLuat.schema';
import { SinhVien, SinhVienDocument } from '../schemas/SinhVien.schema';
import { CreateDisciplineDto } from './dto/create-discipline.dto';

@Injectable()
export class KyLuatService {
  constructor(
    @InjectModel(KyLuat.name) private kyLuatModel: Model<KyLuatDocument>,
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
  ) {}

  async getDisciplineByMSSV(mssv: string) {
    const disciplines = await this.kyLuatModel
      .find({ SinhVienID: mssv })
      .populate('SinhVienID')
      .exec();
    return disciplines;
  }

  async addDiscipline(createDisciplineDto: CreateDisciplineDto) {
    const newDiscipline = new this.kyLuatModel(createDisciplineDto);
    return newDiscipline.save();
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
    const discipline = await this.kyLuatModel.findById(_id).exec();
    if (!discipline) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    return discipline;
  }
}
