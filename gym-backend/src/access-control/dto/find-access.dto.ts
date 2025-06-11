import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsIn,
} from 'class-validator';
import { AccessStatus, Modality } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { AccessSortField } from '../types/access-control.types';

export class FindAccessDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(AccessStatus)
  status?: AccessStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(Modality)
  modality?: Modality;

  @IsOptional()
  @IsIn(['accessDate', 'status', 'modality', 'userName', 'userDni'])
  sortBy?: AccessSortField;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}
