import { IsString, IsNumber, IsPositive, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class UpdateCompraDto {
  @IsString()
  @IsOptional()
  nombreProducto?: string;

  @IsString()
  @IsOptional()
  codigoProducto?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  precioCompra?: number;

  @IsDateString()
  @IsOptional()
  fechaCompra?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
