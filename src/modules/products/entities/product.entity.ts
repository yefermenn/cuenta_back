import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SaleDetail } from '../../sales/entities/sale-detail.entity';

@Entity('products')
@Index(['user', 'codigo'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'int'})
  precioCompra: number;

  @Column({ type: 'int'})
  precioVenta: number;

  @Column({ type: 'varchar', length: 50 })
  codigo: string; // SKU

  @Column({ type: 'int' })
  inventario: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.product)
  saleDetails: SaleDetail[];
}
