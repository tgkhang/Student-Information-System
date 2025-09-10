import { Module } from '@nestjs/common';
import { DiemDanhService } from './DiemDanh.service';
import { DiemDanhController } from './DiemDanh.controller';
import { DiemDanh, DiemDanhSchema } from 'src/schemas/DiemDanh.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';
import { GiangVienModule } from 'src/GiangVien/GiangVien.module';
import { KhoaHocModule } from 'src/KhoaHoc/KhoaHoc.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiemDanh.name, schema: DiemDanhSchema },
    ]),
    AuthModule,
    SinhVienModule,
    GiangVienModule,
    KhoaHocModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [DiemDanhService],
  controllers: [DiemDanhController],
  exports: [MongooseModule],
})
export class DiemDanhModule {}
