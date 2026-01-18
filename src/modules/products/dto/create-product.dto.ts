import {
  IsString,
  IsNumber,
  IsPositive,
  IsNotEmpty,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  precio: number;

  @IsString()
  @IsNotEmpty()
  codigo: string; // SKU

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  inventario: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
