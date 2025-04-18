import { forwardRef, Module } from '@nestjs/common';
import { GiangVienService } from './GiangVien.service';
import { GiangVienController } from './GiangVien.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GiangVien, GiangVienSchema } from 'src/schemas/GiangVien.schema';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { KhoaHocModule } from 'src/KhoaHoc/KhoaHoc.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiangVien.name, schema: GiangVienSchema },
    ]),
    forwardRef(() => KhoaHocModule),
    AuthModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [GiangVienService],
  controllers: [GiangVienController],
  exports: [GiangVienService, MongooseModule],
})
export class GiangVienModule {}
