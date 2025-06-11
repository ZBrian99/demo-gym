import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsUUID,
} from 'class-validator';
import { Modality } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class FindEnrollmentsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(Modality)
  modality?: Modality;

  @IsOptional()
  @IsDateString()
  // @TransformToISODate()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  // @TransformToISODate()
  endDate?: string;
}
