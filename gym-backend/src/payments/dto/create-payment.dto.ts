import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  Min,
  IsString,
} from 'class-validator';
import { Currency, Modality } from '@prisma/client';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  enrollmentId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(Currency)
  currency: Currency;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsNumber()
  // @Min(0)
  // @Max(100)
  discount?: number;

  @IsEnum(Modality)
  modality: Modality;
}
