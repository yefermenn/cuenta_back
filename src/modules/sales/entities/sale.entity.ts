import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SaleDetail } from './sale-detail.entity';

export enum SaleStatus {
  PENDING = 'pendiente',
  PAID = 'pagada',
  CANCELLED = 'cancelada',
}

export enum PaymentMethod {
  CASH = 'efectivo',
  NEQUI = 'nequi'
}

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_venta: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  metodo_pago: PaymentMethod;

  @Column({
    type: 'enum',
    enum: SaleStatus,
    default: SaleStatus.PENDING,
  })
  estado: SaleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.sales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale, { cascade: true })
  saleDetails: SaleDetail[];
}
