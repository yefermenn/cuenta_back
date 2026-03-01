import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale, SaleStatus } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(SaleDetail)
    private saleDetailsRepository: Repository<SaleDetail>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    // Validar que el usuario exista
    await this.usersService.findOne(createSaleDto.userId);

    // Validar que haya al menos un item
    if (!createSaleDto.items || createSaleDto.items.length === 0) {
      throw new BadRequestException('La venta debe contener al menos un producto');
    }

    // Crear la venta
    const sale = this.salesRepository.create({
      userId: createSaleDto.userId,
      fecha: createSaleDto.fecha ? new Date(createSaleDto.fecha) : new Date(),
      metodo_pago: createSaleDto.metodo_pago,
      estado: SaleStatus.PENDING,
      total_venta: 0,
    });

    let totalVenta = 0;
    const saleDetails: SaleDetail[] = [];

    // Procesar cada detalle de venta
    for (const item of createSaleDto.items) {
      const product = await this.productsService.findOne(item.productId);

      // Validar que el producto pertenece al usuario
      if (product.userId !== createSaleDto.userId) {
        throw new BadRequestException(
          `El producto ${product.nombre} no pertenece a este usuario`,
        );
      }

      // Validar inventario
      if (product.inventario < item.cantidad) {
        throw new BadRequestException(
          `Inventario insuficiente para el producto ${product.nombre}. Disponible: ${product.inventario}, Solicitado: ${item.cantidad}`,
        );
      }

      // Calcular subtotal
      const subtotal = Number(product.precioVenta) * item.cantidad;
      totalVenta += subtotal;

      // Crear detalle de venta
      const saleDetail = this.saleDetailsRepository.create({
        productId: product.id,
        cantidad: item.cantidad,
        precio_unitario: product.precioVenta,
        subtotal,
      });

      saleDetails.push(saleDetail);
    }

    // Actualizar total de la venta
    sale.total_venta = totalVenta;

    // Guardar la venta con sus detalles
    const savedSale = await this.salesRepository.save(sale);

    // Guardar los detalles de venta
    for (const saleDetail of saleDetails) {
      saleDetail.saleId = savedSale.id;
      await this.saleDetailsRepository.save(saleDetail);
    }

    // Descontar inventario de los productos
    for (const item of createSaleDto.items) {
      await this.productsService.decreaseInventory(item.productId, item.cantidad);
    }

    // Recargar la venta con sus relaciones
    return this.findOne(savedSale.id);
  }

  async findAll(userId?: string): Promise<Sale[]> {
    const query = this.salesRepository.createQueryBuilder('sale');

    if (userId) {
      query.where('sale.userId = :userId', { userId });
    }

    return query.leftJoinAndSelect('sale.saleDetails', 'saleDetails')
      .leftJoinAndSelect('saleDetails.product', 'product')
      .orderBy('sale.fecha', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['user', 'saleDetails', 'saleDetails.product'],
    });

    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);

    // Validar cambios de estado
    if (updateSaleDto.estado) {
      if (sale.estado === SaleStatus.CANCELLED) {
        throw new BadRequestException('No se puede actualizar una venta cancelada');
      }

      if (
        updateSaleDto.estado === SaleStatus.CANCELLED &&
        sale.estado === SaleStatus.PAID
      ) {
        // Restaurar inventario cuando se cancela una venta pagada
        for (const detail of sale.saleDetails) {
          await this.productsService.increaseInventory(
            detail.productId,
            detail.cantidad,
          );
        }
      }
    }

    // Procesar actualización de detalles de venta si se proporcionan
    if (updateSaleDto.items !== undefined) {
      let totalVenta = 0;
      const newSaleDetails: SaleDetail[] = [];
      const itemIds = new Set<string>();

      // Procesar cada item en la actualización
      for (const item of updateSaleDto.items) {
        // Si no tiene ID, es un nuevo detalle
        if (!item.id) {
          if (!item.productId || !item.cantidad) {
            throw new BadRequestException(
              'Los nuevos detalles deben incluir productId y cantidad',
            );
          }

          const product = await this.productsService.findOne(item.productId);

          // Validar que el producto pertenece al usuario
          if (product.userId !== sale.userId) {
            throw new BadRequestException(
              `El producto ${product.nombre} no pertenece a este usuario`,
            );
          }

          // Validar inventario (sumar lo que ya está en otros detalles)
          const usedInventory = sale.saleDetails.reduce(
            (sum, detail) => sum + detail.cantidad,
            0,
          );
          if (product.inventario - usedInventory < item.cantidad) {
            throw new BadRequestException(
              `Inventario insuficiente para el producto ${product.nombre}. Disponible: ${product.inventario - usedInventory}, Solicitado: ${item.cantidad}`,
            );
          }

          // Crear nuevo detalle de venta
          const subtotal = Number(product.precioVenta) * item.cantidad;
          totalVenta += subtotal;

          const newDetail = this.saleDetailsRepository.create({
            productId: product.id,
            cantidad: item.cantidad,
            precio_unitario: product.precioVenta,
            subtotal,
            saleId: sale.id,
          });

          newSaleDetails.push(newDetail);
        } else {
          // Es un detalle existente
          itemIds.add(item.id);
          const existingDetail = sale.saleDetails.find(
            (detail) => detail.id === item.id,
          );

          if (!existingDetail) {
            throw new BadRequestException(
              `Detalle de venta con ID ${item.id} no encontrado en la venta ${sale.id}`,
            );
          }

          // Si se proporciona productId o cantidad, actualizar
          if (item.productId || item.cantidad) {
            const productId = item.productId || existingDetail.productId;
            const cantidad = item.cantidad || existingDetail.cantidad;

            const product = await this.productsService.findOne(productId);

            // Validar que el producto pertenece al usuario
            if (product.userId !== sale.userId) {
              throw new BadRequestException(
                `El producto ${product.nombre} no pertenece a este usuario`,
              );
            }

            // Validar inventario restando lo que ya está vendido
            const oldQuantity = existingDetail.cantidad;
            const quantityDifference = cantidad - oldQuantity;

            if (product.inventario < quantityDifference) {
              throw new BadRequestException(
                `Inventario insuficiente para el producto ${product.nombre}. Disponible: ${product.inventario}, Necesario: ${quantityDifference}`,
              );
            }

            // Actualizar inventario
            if (quantityDifference !== 0) {
              if (quantityDifference > 0) {
                await this.productsService.decreaseInventory(
                  productId,
                  quantityDifference,
                );
              } else {
                await this.productsService.increaseInventory(
                  productId,
                  Math.abs(quantityDifference),
                );
              }
            }

            // Actualizar el detalle
            existingDetail.productId = productId;
            existingDetail.cantidad = cantidad;
            existingDetail.precio_unitario = product.precioVenta;
            existingDetail.subtotal = Number(product.precioVenta) * cantidad;

            await this.saleDetailsRepository.save(existingDetail);
          }

          totalVenta += Number(existingDetail.subtotal);
        }
      }

      // Eliminar detalles que no están en la lista actualizada
      const detailsToDelete = sale.saleDetails.filter(
        (detail) => !itemIds.has(detail.id),
      );

      for (const detail of detailsToDelete) {
        // Restaurar inventario
        await this.productsService.increaseInventory(
          detail.productId,
          detail.cantidad,
        );
        await this.saleDetailsRepository.remove(detail);
      }

      // actualizar la colección en memoria para evitar re-inserción por cascada
      sale.saleDetails = sale.saleDetails.filter(
        (detail) => itemIds.has(detail.id),
      );

      // Guardar nuevos detalles
      for (const newDetail of newSaleDetails) {
        await this.saleDetailsRepository.save(newDetail);
        sale.saleDetails.push(newDetail); // añadir a la venta en memoria
      }

      // Actualizar total de venta
      sale.total_venta = totalVenta;
    }

    // Actualizar estado y método de pago si se proporcionan
    if (updateSaleDto.estado) {
      sale.estado = updateSaleDto.estado;
    }

    if (updateSaleDto.metodo_pago) {
      sale.metodo_pago = updateSaleDto.metodo_pago;
    }

    return this.salesRepository.save(sale);
  }

  async remove(id: string): Promise<void> {
    const sale = await this.findOne(id);

    // Restaurar inventario antes de eliminar
    for (const detail of sale.saleDetails) {
      await this.productsService.increaseInventory(detail.productId, detail.cantidad);
    }

    await this.salesRepository.remove(sale);
  }

  async getSalesReport(userId: string): Promise<any> {
    const sales = await this.findAll(userId);

    const report = {
      totalVentas: sales.length,
      ventasPagadas: sales.filter((s) => s.estado === SaleStatus.PAID).length,
      ventasCanceladas: sales.filter((s) => s.estado === SaleStatus.CANCELLED).length,
      montoTotal: sales.reduce((sum, s) => sum + Number(s.total_venta), 0),
      montoPagado: sales
        .filter((s) => s.estado === SaleStatus.PAID)
        .reduce((sum, s) => sum + Number(s.total_venta), 0),
      metodoPago: this.getPaymentMethodStats(sales),
    };

    return report;
  }

  private getPaymentMethodStats(sales: Sale[]): any {
    const stats = {};

    sales.forEach((sale) => {
      const method = sale.metodo_pago || 'no especificado';
      if (!stats[method]) {
        stats[method] = { cantidad: 0, monto: 0 };
      }
      stats[method].cantidad++;
      stats[method].monto += Number(sale.total_venta);
    });

    return stats;
  }
}
