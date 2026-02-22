import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Compra } from '../../compra/entities/compra.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', default:false})
  shift: boolean;

  @Column({ type: 'int', default:0})
  base: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Product, (product) => product.user, { cascade: true })
  products: Product[];

  @OneToMany(() => Sale, (sale) => sale.user, { cascade: true })
  sales: Sale[];

  @OneToMany(() => Compra, (compra) => compra.user, { cascade: true })
  compras: Compra[];
}
