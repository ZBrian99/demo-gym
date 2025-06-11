import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FindPaymentsDto } from './dto/find-payments.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Auth(Role.ADMIN, Role.STAFF)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll(@Query() queryDto: FindPaymentsDto) {
    return this.paymentsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(id);
  }

  // @Get('user/:userId')
  // findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
  //   return this.paymentsService.findByUser(userId);
  // }

  // @Get('enrollment/:enrollmentId')
  // findByEnrollment(@Param('enrollmentId', ParseUUIDPipe) enrollmentId: string) {
  //   return this.paymentsService.findByEnrollment(enrollmentId);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.remove(id);
  }

  @Get('user/:userId')
  async getUserPaymentHistory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() queryDto: FindPaymentsDto,
  ) {
    return this.paymentsService.getUserPaymentHistory(userId, queryDto);
  }
}
