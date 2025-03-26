import { Module } from '@nestjs/common';
import { KhoaService } from './khoa.service';
import { KhoaController } from './khoa.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Khoa, KhoaSchema } from 'src/schemas/Khoa.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Khoa.name, schema: KhoaSchema}]),
    JwtModule.register({
                  secret: 'abc123',
                  signOptions: { expiresIn: '1h' },
                }),
    
  ],
  providers: [KhoaService],
  controllers: [KhoaController],
})
export class KhoaModule {}
