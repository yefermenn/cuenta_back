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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Crear un nuevo producto (PROTEGIDO)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async create(@Body(ValidationPipe) createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  /**
   * Obtener todos los productos (PÚBLICO)
   */
  @Get()
  async findAll(@Query('userId') userId?: string): Promise<Product[]> {
    return this.productsService.findAll(userId);
  }

  /**
   * Obtener un producto por ID (PÚBLICO)
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  /**
   * Actualizar un producto (PROTEGIDO)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Eliminar un producto (PROTEGIDO)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
