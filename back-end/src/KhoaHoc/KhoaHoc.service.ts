import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KhoaHoc, KhoaHocDocument } from 'src/schemas/KhoaHoc.schema';
import { AddCourseDto } from './dto/add-KhoaHoc.dto';
import { GetCourseListDto } from './dto/getListCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';

@Injectable()
export class KhoaHocService {
    constructor(
        @InjectModel(KhoaHoc.name) private readonly khoaHocModel: Model<KhoaHocDocument>,

    ){}


    async addCourse(KhoaHocdto: AddCourseDto)
    {

        const TenKhoaHoc = KhoaHocdto.TenKhoaHoc;
        const MaKhoaHoc = await this.generateCoursename(TenKhoaHoc);
        const SoTinChi = KhoaHocdto.SoTinChi;
        const MoTa = KhoaHocdto.MoTa;
        const GiangVienID = KhoaHocdto.GiangVienID;
        const TroGiangID = KhoaHocdto.TroGiangID;
        console.log('validate: ',MaKhoaHoc);
        const khoaHoc = new this.khoaHocModel({
            MaKhoaHoc,
            TenKhoaHoc,   
            GiangVienID,
            TroGiangID,
            SoTinChi,
            MoTa,      
            NgayCapNhat: Date.now()
        });
        return khoaHoc.save();
    }

    async generateCoursename(fullName: string): Promise<string> {
        const normalizedFullName = this.removeDiacritics(fullName);
        const nameParts = normalizedFullName.trim().split(' ');
        // const lastName = nameParts.pop();
        const initials = nameParts.map(word => word.charAt(0).toUpperCase()).join('');
        const count = await this.khoaHocModel.countDocuments();
        const username = `${initials}${(count + 1).toString().padStart(4, '0')}`;
        return username;
    }
    private removeDiacritics(str: string): string {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    async getCourse(MaKhoaHoc: string)
    {
        console.log('Mã khóa học',MaKhoaHoc);
        const khoaHoc = await this.khoaHocModel.findOne({ MaKhoaHoc}).populate('GiangVienID', 'HoTen').populate('TroGiangID', 'HoTen').exec();
        return khoaHoc;
    }

    async getListCourse(query: GetCourseListDto)
    {
        const { pageSize, pageNumber, sortBy, sortOrder } = query;
            
        if (!pageSize || !pageNumber || !sortBy || !sortOrder)
            throw new BadRequestException('Thiếu các trường cần thiết');

        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize;
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const khoaHocs = await this.khoaHocModel
            .find()
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .populate('GiangVienID', 'HoTen')
            .exec();;

        console.log(khoaHocs);
        return {
            pageSize,
            pageNumber,
            total: await this.khoaHocModel.countDocuments(),
            data: khoaHocs,
        };
    }

    async updateCourse(MaKhoaHoc: string, updateCourseDto: UpdateCourseDto){
        const khoaHoc = await this.khoaHocModel.findOne({ MaKhoaHoc });
        console.log(MaKhoaHoc);
        if (!khoaHoc) {
            throw new NotFoundException('Khóa học không tồn tại');
        }

        if (updateCourseDto.TenKhoaHoc) {
            const existingName = await this.khoaHocModel.findOne({TenKhoaHoc: updateCourseDto.TenKhoaHoc});
            if (existingName && existingName.MaKhoaHoc !== MaKhoaHoc) {
                throw new BadRequestException('Tên khóa học đã tồn tại');
            }
        }
    
        const updatedKhoaHoc = await this.khoaHocModel.findOneAndUpdate(
        { MaKhoaHoc },
        { $set: updateCourseDto, NgayCapNhat: new Date() },
        { new: true },
        );

        return updatedKhoaHoc;
    }

    async deleteCourse(MaKhoaHoc: string){
        // return await this.khoaHocModel.findOneAndDelete({MaKhoaHoc}).exec();
        try{
            const khoaHoc = await this.khoaHocModel.findOne({MaKhoaHoc});
            if (!khoaHoc) {
                throw new NotFoundException('Khóa học không tồn tại.');
            }
            await this.khoaHocModel.findOneAndDelete({MaKhoaHoc}).exec();
        }
        catch(error)
        {
            throw new Error(`Xóa khóa học thất bại: ${error.message}`);
        }
    }

    async searchCourse(query: string) {
        console.log('query', query);
        const khoaHoc = await this.khoaHocModel.find({
            $or: [
                {MaKhoaHoc: {$regex: query, $options: 'i'}},
                {TenKhoaHoc: {$regex: query, $options:'i'}}
            ]
        })
        if (khoaHoc.length === 0)
            throw new NotFoundException('Không tìm thấy khóa học.');

        return khoaHoc;
    }
}
