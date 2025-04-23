import { forwardRef, Module } from '@nestjs/common';
import { BaiKiemTraService } from './BaiKiemTra.service';
import { BaiKiemTraController } from './BaiKiemTra.controller';
import { BaiKiemTra, BaiKiemTraSchema } from 'src/schemas/BaiKiemTra.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';
import { GiangVienModule } from 'src/GiangVien/GiangVien.module';
import { KhoaHocModule } from 'src/KhoaHoc/KhoaHoc.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BaiKiemTra.name, schema: BaiKiemTraSchema },
    ]),
    AuthModule,
    forwardRef(() => SinhVienModule),
    forwardRef(() => GiangVienModule),
    forwardRef(() => KhoaHocModule),
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [BaiKiemTraService],
  controllers: [BaiKiemTraController],
  exports: [BaiKiemTraService, MongooseModule],
})
export class BaiKiemTraModule {}
