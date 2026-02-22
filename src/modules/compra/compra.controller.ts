import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra } from './entities/compra.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('compras')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createCompraDto: CreateCompraDto): Promise<Compra> {
    return this.compraService.create(createCompraDto);
  }

  @Get()
  async findAll(@Query('userId') userId?: string): Promise<Compra[]> {
    return this.compraService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Compra> {
    return this.compraService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCompraDto: UpdateCompraDto,
  ): Promise<Compra> {
    return this.compraService.update(id, updateCompraDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.compraService.remove(id);
  }
}
