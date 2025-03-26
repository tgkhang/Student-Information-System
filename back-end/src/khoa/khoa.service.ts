import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Khoa, KhoaDocument } from 'src/schemas/Khoa.schema';
import { addKhoaDTO } from './dto/addKhoa.dto';
import { getFacultyListDTO } from './dto/getFacultyList.dto';

@Injectable()
export class KhoaService {
    constructor(
        @InjectModel(Khoa.name) private readonly Khoamodel: Model<KhoaDocument>,
    ){}
    
    async addKhoa(khoadto: addKhoaDTO): Promise<Khoa> {
        const khoa = new this.Khoamodel(khoadto);
        return khoa.save();
    }

    async getKhoa(name: string) {
        const khoa = this.Khoamodel.findOne({TenKhoa: name}).exec();
        return khoa;
    }

    async getKhoaByID(id: string){
        const khoa = this.Khoamodel.findById(id).exec();
        return khoa;
    }

    async getListFaculty(query: getFacultyListDTO)
    {
        const { pageSize, pageNumber, sortBy, sortOrder } = query;
            
        if (!pageSize || !pageNumber || !sortBy || !sortOrder)
            throw new BadRequestException('Thiếu các trường cần thiết');

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const khoas = await this.Khoamodel
            .find()
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .exec();;

        console.log(khoas);
        return {
            pageSize,
            pageNumber,
            total: await this.Khoamodel.countDocuments(),
            data: khoas,
        };
    }
    
}
