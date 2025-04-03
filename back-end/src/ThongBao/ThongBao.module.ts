import { Module } from '@nestjs/common';
import { ThongBaoService } from './ThongBao.service';
import { ThongBaoController } from './ThongBao.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ThongBaos, ThongBaosSchema } from 'src/schemas/ThongBao.schema';
import { SinhVienService } from 'src/SinhVien/SinhVien.service';
import { GiangVienService } from 'src/GiangVien/GiangVien.service';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';
import { GiangVienModule } from 'src/GiangVien/GiangVien.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { KhoaHoc, KhoaHocSchema } from 'src/schemas/KhoaHoc.schema';
import { KhoaHocService } from 'src/KhoaHoc/KhoaHoc.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ThongBaos.name, schema: ThongBaosSchema },
      { name: KhoaHoc.name, schema: KhoaHocSchema },
    ]),
    SinhVienModule,
    GiangVienModule,

    AuthModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    ThongBaoService,
    SinhVienService,
    GiangVienService,
    KhoaHocService,
  ],
  controllers: [ThongBaoController],
})
export class ThongBaosModule {}
