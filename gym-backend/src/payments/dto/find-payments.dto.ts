import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsUUID,
} from 'class-validator';
import { Currency } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class FindPaymentsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  enrollmentId?: string;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsDateString()
  // @TransformToISODate()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  // @TransformToISODate()
  endDate?: string;
}
