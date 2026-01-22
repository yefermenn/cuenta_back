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
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Crear una nueva venta (PROTEGIDO)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  /**
   * Obtener todas las ventas (PROTEGIDO)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('userId') userId?: string): Promise<Sale[]> {
    return this.salesService.findAll(userId);
  }

  /**
   * Obtener reporte de ventas (PROTEGIDO)
   */
  @Get('report/:userId')
  @UseGuards(JwtAuthGuard)
  async getSalesReport(@Param('userId') userId: string): Promise<any> {
    return this.salesService.getSalesReport(userId);
  }

  /**
   * Obtener una venta por ID (PROTEGIDO)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }

  /**
   * Actualizar una venta (PROTEGIDO)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    return this.salesService.update(id, updateSaleDto);
  }

  /**
   * Eliminar una venta (PROTEGIDO)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.salesService.remove(id);
  }
}
