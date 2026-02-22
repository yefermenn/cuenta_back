import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompraService {
  constructor(
    @InjectRepository(Compra)
    private comprasRepository: Repository<Compra>,
    private usersService: UsersService,
  ) {}

  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    // Validar que el usuario exista
    await this.usersService.findOne(createCompraDto.userId);

    const compra = this.comprasRepository.create({
      ...createCompraDto,
      fechaCompra: new Date(createCompraDto.fechaCompra),
    });

    return this.comprasRepository.save(compra);
  }

  async findAll(userId?: string): Promise<Compra[]> {
    const query = this.comprasRepository.createQueryBuilder('compra');

    if (userId) {
      query.where('compra.userId = :userId', { userId });
    }

    return query.leftJoinAndSelect('compra.user', 'user').getMany();
  }

  async findOne(id: string): Promise<Compra> {
    const compra = await this.comprasRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    return compra;
  }

  async update(id: string, updateCompraDto: UpdateCompraDto): Promise<Compra> {
    const compra = await this.findOne(id);

    if (updateCompraDto.fechaCompra) {
      updateCompraDto.fechaCompra = new Date(updateCompraDto.fechaCompra).toISOString();
    }

    Object.assign(compra, updateCompraDto);
    return this.comprasRepository.save(compra);
  }

  async remove(id: string): Promise<void> {
    const compra = await this.findOne(id);
    await this.comprasRepository.remove(compra);
  }
}
