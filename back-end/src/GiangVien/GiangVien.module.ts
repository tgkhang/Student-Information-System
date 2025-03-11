import { Module } from '@nestjs/common';
import { GiangVienService } from './GiangVien.service';
import { GiangVienController } from './GiangVien.controller';
import { MongooseError } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { GiangVien, GiangVienSchema } from 'src/schemas/GiangVien.schema';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeature([{name: GiangVien.name, schema: GiangVienSchema}]),
    AuthModule,
    JwtModule.register({
          secret: 'abc123',
          signOptions: { expiresIn: '1h' },
        }),
  ],
  providers: [GiangVienService],
  controllers: [GiangVienController]
})
export class GiangVienModule {}
