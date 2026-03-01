import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Product } from '../modules/products/entities/product.entity';
import { Sale } from '../modules/sales/entities/sale.entity';
import { SaleDetail } from '../modules/sales/entities/sale-detail.entity';
import { Compra } from '../modules/compra/entities/compra.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'cuenta',
  password: process.env.DB_PASSWORD || 'CAmi.lo_123',
  database: process.env.DB_DATABASE || 'cuenta_helados',
  entities: [User, Product, Sale, SaleDetail, Compra],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
});
