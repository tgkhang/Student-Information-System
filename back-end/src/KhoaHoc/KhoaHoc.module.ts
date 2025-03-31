import { Module } from '@nestjs/common';
import { KhoaHocService } from './KhoaHoc.service';
import { KhoaHocController } from './KhoaHoc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { KhoaHoc, KhoaHocSchema } from 'src/schemas/KhoaHoc.schema';
import { JwtModule } from '@nestjs/jwt';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';
import { SinhVienService } from 'src/SinhVien/SinhVien.service';
import { GiangVienModule } from 'src/GiangVien/GiangVien.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: KhoaHoc.name, schema: KhoaHocSchema }]),
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
    SinhVienModule,
    GiangVienModule,
    AuthModule,
  ],
  providers: [KhoaHocService, SinhVienService],
  controllers: [KhoaHocController],
  exports: [MongooseModule, KhoaHocService],
})
export class KhoaHocModule {}
