import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  precio?: number;

  @IsString()
  @IsOptional()
  codigo?: string; // SKU

  @IsNumber()
  @Min(0)
  @IsOptional()
  inventario?: number;

  @IsUUID()
  @IsOptional()
  userId?: string;
}
