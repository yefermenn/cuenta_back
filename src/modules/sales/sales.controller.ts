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
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  async findAll(@Query('userId') userId?: string): Promise<Sale[]> {
    return this.salesService.findAll(userId);
  }

  @Get('report/:userId')
  async getSalesReport(@Param('userId') userId: string): Promise<any> {
    return this.salesService.getSalesReport(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.salesService.remove(id);
  }
}
