import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsIn,
} from 'class-validator';
import { Modality, Role } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SortField, UserStatus } from '../types/user.types';

export class FindUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(Modality)
  modality?: Modality | 'ALL';

  @IsOptional()
  @IsIn(['ALL', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'NO_ENROLLMENT', 'SUSPENDED'])
  status?: UserStatus;

  @IsOptional()
  @IsIn(['name', 'lastName', 'dni', 'phone', 'status', 'modality'])
  sortBy?: SortField;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @IsOptional()
  @IsDateString()
  updatedFrom?: string;

  @IsOptional()
  @IsDateString()
  updatedTo?: string;
}
