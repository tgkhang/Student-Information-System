import { Module } from '@nestjs/common';
import { DiemSoService } from './DiemSo.service';
import { DiemSoController } from './DiemSo.controller';
import { DiemSo, DiemSoSchema } from 'src/schemas/DiemSo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';
import { KhoaHocModule } from 'src/KhoaHoc/KhoaHoc.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DiemSo.name, schema: DiemSoSchema }]),
    AuthModule,
    SinhVienModule,
    DiemSoModule,
    KhoaHocModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [DiemSoService],
  controllers: [DiemSoController],
  exports: [MongooseModule],
})
export class DiemSoModule {}
