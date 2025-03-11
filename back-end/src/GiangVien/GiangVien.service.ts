import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GiangVien, GiangVienDocument } from 'src/schemas/GiangVien.schema';

@Injectable()
export class GiangVienService {
    constructor(
        @InjectModel(GiangVien.name) private readonly GiangVienModel: Model<GiangVienDocument>,

    ){}

    async addTeacher(MaGV:string, HoTen: string, ChucVu: string): Promise<GiangVien>{
        const newTeacher = new this.GiangVienModel({
            HoTen,
            NgaySinh: null,
            GioiTinh: null,
            DiaChi: null,
            SoDienThoai: null,
            ChucVu,
            Khoa: null,
            CCCD: null,
            TrinhDo: null,
        })
        return newTeacher.save();
    }

    private removeDiacritics(str: string): string {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    async generateUsername(fullName: string): Promise<string> {
        const normalizedFullName = this.removeDiacritics(fullName);
    
        const nameParts = normalizedFullName.trim().split(' ');
    
        const lastName = nameParts.pop();
    
        const initials = nameParts.map(word => word.charAt(0).toUpperCase()).join('');
    
        const count = await this.GiangVienModel.countDocuments();
    
        const username = `${initials}${lastName}${(count + 1).toString().padStart(4, '0')}`;
    
        return username;
      }
    
}
