import { forwardRef, Module } from '@nestjs/common';
import { PhuHuynhService } from './PhuHuynh.service';
import { PhuHuynhController } from './PhuHuynh.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhuHuynh, PhuHuynhSchema } from 'src/schemas/PhuHuynh.schema';
import { JwtModule } from '@nestjs/jwt';
import { KyLuatModule } from 'src/KyLuat/KyLuat.module';
import { AuthModule } from 'src/auth/auth.module';
import { SinhVienModule } from 'src/SinhVien/SinhVien.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhuHuynh.name, schema: PhuHuynhSchema },
    ]),
    AuthModule,
    forwardRef(() => KyLuatModule),
    SinhVienModule,
    JwtModule.register({
      secret: 'abc123',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [MongooseModule],
  providers: [PhuHuynhService],
  controllers: [PhuHuynhController],
})
export class PhuHuynhModule {}
