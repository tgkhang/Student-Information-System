import { forwardRef, Module } from '@nestjs/common';
import { LichHocService } from './LichHoc.service';
import { LichHocController } from './LichHoc.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LichHoc, LichHocSchema } from 'src/schemas/LichHoc.schema';
import { AuthModule } from 'src/auth/auth.module';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';
import { PhuHuynhModule } from 'src/PhuHuynh/PhuHuynh.module';
import { JwtModule } from '@nestjs/jwt';
import { GiangVienModule } from 'src/GiangVien/GiangVien.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LichHoc.name, schema: LichHocSchema }]),
    AuthModule,
    forwardRef(() => SinhVienModule),
    forwardRef(() => GiangVienModule),
    PhuHuynhModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [LichHocService],
  controllers: [LichHocController],
  exports: [MongooseModule],
})
export class LichHocModule {}
