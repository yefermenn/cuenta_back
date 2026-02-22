import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private usersService: UsersService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validar que el usuario exista
    await this.usersService.findOne(createProductDto.userId);

    // Validar que el código (SKU) sea único por usuario
    const existingProduct = await this.productsRepository.findOne({
      where: {
        userId: createProductDto.userId,
        codigo: createProductDto.codigo,
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Ya existe un producto con el código ${createProductDto.codigo} para este usuario`,
      );
    }

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(userId?: string): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product');

    if (userId) {
      query.where('product.userId = :userId', { userId });
    }

    return query.leftJoinAndSelect('product.saleDetails', 'saleDetails').getMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'saleDetails'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Si se intenta actualizar el código, validar que sea único por usuario
    if (updateProductDto.codigo && updateProductDto.codigo !== product.codigo) {
      const existingProduct = await this.productsRepository.findOne({
        where: {
          userId: product.userId,
          codigo: updateProductDto.codigo,
        },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Ya existe un producto con el código ${updateProductDto.codigo} para este usuario`,
        );
      }
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async decreaseInventory(productId: number, quantity: number): Promise<void> {
    const product = await this.findOne(productId);

    if (product.inventario < quantity) {
      throw new ConflictException(
        `Inventario insuficiente para el producto ${product.nombre}. Disponible: ${product.inventario}`,
      );
    }

    product.inventario -= quantity;
    await this.productsRepository.save(product);
  }

  async increaseInventory(productId: number, quantity: number): Promise<void> {
    const product = await this.findOne(productId);
    product.inventario += quantity;
    await this.productsRepository.save(product);
  }
}
