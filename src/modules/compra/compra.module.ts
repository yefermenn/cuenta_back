import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Compra]), UsersModule],
  controllers: [CompraController],
  providers: [CompraService],
  exports: [CompraService],
})
export class CompraModule {}
