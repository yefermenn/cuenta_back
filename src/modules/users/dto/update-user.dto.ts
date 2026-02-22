import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  shift?: boolean;

  @IsNumber()
  @IsOptional()
  base?: number;
}
