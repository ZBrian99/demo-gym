import {
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email?: string | null;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  dni: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  @IsDateString()
  birthDate?: string | null;

  @IsString()
  phone: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.USER;

  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}
