import {
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SaleStatus, PaymentMethod } from '../entities/sale.entity';

export class UpdateSaleDetailDto {
  @IsUUID()
  @IsOptional()
  id?: string; // Si existe, actualiza; si no, crea

  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  cantidad?: number;
}

export class UpdateSaleDto {
  @IsEnum(SaleStatus)
  @IsOptional()
  estado?: SaleStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  metodo_pago?: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSaleDetailDto)
  @IsOptional()
  items?: UpdateSaleDetailDto[];
}
