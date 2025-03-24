import { forwardRef, Module } from '@nestjs/common';
import { KyLuatService } from './KyLuat.service';
import { KyLuatController } from './KyLuat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { KyLuat, KyLuatSchema } from 'src/schemas/KyLuat.schema';
import { SinhVienModule } from '../SinhVien/SinhVien.module';
import { JwtModule } from '@nestjs/jwt';
import { PhuHuynhModule } from 'src/PhuHuynh/PhuHuynh.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: KyLuat.name, schema: KyLuatSchema }]),
    AuthModule,
    SinhVienModule,
    forwardRef(() => PhuHuynhModule),
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [KyLuatService],
  controllers: [KyLuatController],
  exports: [KyLuatService],
})
export class KyLuatModule {}
