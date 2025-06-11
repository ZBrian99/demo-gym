import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdatePaymentDto extends PartialType(
  OmitType(CreatePaymentDto, ['enrollmentId'] as const),
) {}
