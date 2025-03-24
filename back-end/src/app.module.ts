import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SinhVienModule } from './SinhVien/SinhVien.module';
import { GiangVienModule } from './GiangVien/GiangVien.module';
import { JWTAuthGuard } from './auth/guards/jwt.guard';
import { KhoaHocModule } from './KhoaHoc/KhoaHoc.module';

import { KyLuatModule } from './KyLuat/KyLuat.module';
import { PhuHuynhModule } from './PhuHuynh/PhuHuynh.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sis:sis@cluster0.xqphw.mongodb.net/',
    ),
    AuthModule,
    SinhVienModule,
    GiangVienModule,
    KhoaHocModule,
    KyLuatModule,
    PhuHuynhModule,
  ],
})
export class AppModule {}
