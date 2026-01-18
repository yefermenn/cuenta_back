import { IsEnum, IsOptional } from 'class-validator';
import { SaleStatus, PaymentMethod } from '../entities/sale.entity';

export class UpdateSaleDto {
  @IsEnum(SaleStatus)
  @IsOptional()
  estado?: SaleStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  metodo_pago?: PaymentMethod;
}
