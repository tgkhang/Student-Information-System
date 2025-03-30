import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SinhVienModule } from './SinhVien/SinhVien.module';
import { GiangVienModule } from './GiangVien/GiangVien.module';
import { JWTAuthGuard } from './auth/guards/jwt.guard';
import { KhoaHocModule } from './KhoaHoc/KhoaHoc.module';

import { KyLuatModule } from './KyLuat/KyLuat.module';
import { PhuHuynhModule } from './PhuHuynh/PhuHuynh.module';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { KhoaModule } from './khoa/khoa.module';
import { AzureStorageModule } from '@nestjs/azure-storage';
import { ThongBaosModule } from './ThongBao/ThongBao.module';
@Module({
  imports: [
      // MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forRoot(
      'mongodb+srv://sis:sis@cluster0.xqphw.mongodb.net/',
    ),
    // AzureStorageModule.withConfig({
    //   sasKey: process.env.AZURE_STORAGE_SAS_KEY,
    //   accountName: process.env.AZURE_STORAGE_ACCOUNT,
    //   containerName: 'course-documents',
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    AuthModule,
    SinhVienModule,
    GiangVienModule,
    KhoaHocModule,
    KyLuatModule,
    PhuHuynhModule,
    KhoaModule,
    ThongBaosModule,
  ],
})
export class AppModule {}
