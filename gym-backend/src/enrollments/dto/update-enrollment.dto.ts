import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @IsNumber()
  @IsOptional()
  weeklyAccesses?: number;

  @IsDateString()
  @IsOptional()
  // @TransformToISODate()
  lastAccessReset?: string;
}
