import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PhuHuynh,
  PhuHuynhDocument,
  ThongBao,
} from 'src/schemas/PhuHuynh.schema';
import { SinhVien, SinhVienDocument } from 'src/schemas/SinhVien.schema';
import { CreateParentsDto } from './dto/C&U-phuhuynh.dto';
import { KyLuatService } from 'src/KyLuat/KyLuat.service';
import { MailerService } from 'src/auth/mailer/mailer.service';
@Injectable()
export class PhuHuynhService {
  constructor(
    @InjectModel(SinhVien.name) private sinhVienModel: Model<SinhVienDocument>,
    @InjectModel(PhuHuynh.name) private phuHuynhModel: Model<PhuHuynhDocument>,
    private readonly kyLuatService: KyLuatService,
    private readonly mailerService: MailerService,
  ) {}

  async getParentsByMSSV(mssv: string) {
    const sinhVien = await this.sinhVienModel.findOne({ mssv });

    if (!sinhVien) {
      throw new NotFoundException('Sinh viên không tồn tại');
    }

    const infor = await this.phuHuynhModel
      .findOne({ SinhVienID: (sinhVien._id as Types.ObjectId).toString() })
      .populate('SinhVienID')
      .exec();
    return infor;
  }

  async updateParents(
    id: string,
    createParentsDto: CreateParentsDto,
  ): Promise<{ message: string }> {
    const updatedParents = await this.phuHuynhModel.findByIdAndUpdate(
      id,
      createParentsDto,
      { new: true },
    );

    if (!updatedParents) {
      throw new NotFoundException('Cập nhật thông tin phụ huynh thất bại');
    }

    return {
      message: 'Cập nhật thông tin phụ huynh thành công',
    };
  }

  async getParentsById(_id: string): Promise<PhuHuynh> {
    const parents = await this.phuHuynhModel.findById(_id).exec();
    if (!parents) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }
    return parents;
  }

  async addParents(createParentsDto: CreateParentsDto) {
    const newParents = new this.phuHuynhModel(createParentsDto);
    return newParents.save();
  }

  async deleteParentsByMSSV(mssv: string): Promise<any> {
    const student = await this.sinhVienModel.findOne({ mssv });

    if (!student) {
      throw new NotFoundException(`Không tìm thấy sinh viên có MSSV: ${mssv}`);
    }

    const result = await this.phuHuynhModel
      .deleteOne({ SinhVienID: (student._id as Types.ObjectId).toString() })
      .exec();
    return result;
  }

  async getListNoti(SinhVienID: string): Promise<ThongBao[]> {
    const parent = await this.phuHuynhModel
      .findOne({ SinhVienID })
      .populate('ThongBao.KyLuatID')
      .exec();

    if (!parent) {
      throw new NotFoundException(
        'Không tìm thấy phụ huynh với SinhVienID này',
      );
    }

    return parent.ThongBao;
  }

  async sendEmailToParent(_id: string, kyLuatID: string) {
    const parent = await this.phuHuynhModel.findById(_id).exec();
    if (!parent) {
      throw new NotFoundException('Phụ huynh không tồn tại');
    }

    const kyLuat = await this.kyLuatService.getDisciplineById(kyLuatID);
    if (!kyLuat) {
      throw new NotFoundException('Kỷ luật không tồn tại');
    }

    await this.mailerService.sendDisciplineEmail(
      parent.Email,
      parent.HoTen,
      kyLuat.NoiDung,
      kyLuat.HinhThucXuLy,
      kyLuat.NgayLap,
    );
  }
}
