import {
  IsEnum,
  IsDateString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { Modality } from '@prisma/client';

export class CreateEnrollmentDto {
  @IsUUID()
  userId: string;

  @IsEnum(Modality)
  @IsOptional()
  modality: Modality;

  @IsDateString()
  @IsOptional()
  // @TransformToISODate()
  startDate: string;

  @IsDateString()
  @IsOptional()
  // @TransformToISODate()
  endDate: string;

  @IsString()
  @IsOptional()
  comments?: string;

  @IsNumber()
  @IsOptional()
  weeklyAccesses?: number;
}
