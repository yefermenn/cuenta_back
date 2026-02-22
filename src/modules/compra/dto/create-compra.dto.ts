import { IsString, IsNumber, IsPositive, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateCompraDto {
  @IsString()
  @IsNotEmpty()
  nombreProducto: string;

  @IsString()
  @IsNotEmpty()
  codigoProducto: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  precioCompra: number;

  @IsDateString()
  @IsNotEmpty()
  fechaCompra: string; // ISO date-time string

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
