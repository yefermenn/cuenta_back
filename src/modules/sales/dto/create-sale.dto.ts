import {
  IsArray,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  ValidateNested,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/sale.entity';

export class CreateSaleDetailDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  cantidad: number;
}

export class CreateSaleDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  metodo_pago?: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  @IsNotEmpty()
  items: CreateSaleDetailDto[];
}
