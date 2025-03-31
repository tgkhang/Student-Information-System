import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SinhVienModule } from './SinhVien/SinhVien.module';
import { GiangVienModule } from './GiangVien/GiangVien.module';
import { KyLuatModule } from './KyLuat/KyLuat.module';
import { PhuHuynhModule } from './PhuHuynh/PhuHuynh.module';
import { LichHocModule } from './LichHoc/LichHoc.module';
import { KhoaHocModule } from './KhoaHoc/KhoaHoc.module';
import { HocPhiModule } from './HocPhi/HocPhi.module';
import { BaiKiemTraModule } from './BaiKiemTra/BaiKiemTra.module';
import { KhoaModule } from './Khoa/Khoa.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://khavinhthuan114:mle5zI4MPN8L8RHg@cluster0.i1pnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    AuthModule,
    SinhVienModule,
    GiangVienModule,
    KyLuatModule,
    PhuHuynhModule,
    LichHocModule,
    KhoaHocModule,
    HocPhiModule,
    BaiKiemTraModule,
    KhoaModule,
  ],
})
export class AppModule {}
