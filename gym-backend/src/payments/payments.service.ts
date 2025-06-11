import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { FindPaymentsDto } from './dto/find-payments.dto';
import { PaymentResponse } from './types/payment.types';
import { Prisma } from '@prisma/client';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private readonly paymentSelect = {
    id: true,
    enrollmentId: true,
    amount: true,
    currency: true,
    startDate: true,
    endDate: true,
    comments: true,
    discount: true,
    modality: true,
    createdAt: true,
    enrollment: {
      select: {
        modality: true,
        user: {
          select: {
            name: true,
            lastName: true,
            dni: true,
          },
        },
      },
    },
  } as const;

  private buildWhereClause(filters: FindPaymentsDto): Prisma.PaymentWhereInput {
    const { search, enrollmentId, currency, startDate, endDate } = filters;

    return {
      ...(enrollmentId && { enrollmentId }),
      ...(currency && { currency }),
      ...(startDate && { startDate: { gte: new Date(startDate) } }),
      ...(endDate && { endDate: { lte: new Date(endDate) } }),
      ...(search && {
        OR: [
          {
            enrollment: {
              user: { name: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            enrollment: {
              user: { lastName: { contains: search, mode: 'insensitive' } },
            },
          },
          {
            enrollment: {
              user: { dni: { contains: search, mode: 'insensitive' } },
            },
          },
          { comments: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentResponse> {
    try {
      const payment = await this.prisma.$transaction(async (prisma) => {
        const newPayment = await prisma.payment.create({
          data: createPaymentDto,
          select: this.paymentSelect,
        });

        await prisma.enrollment.update({
          where: { id: createPaymentDto.enrollmentId },
          data: {
            startDate: createPaymentDto.startDate,
            endDate: createPaymentDto.endDate,
            modality: createPaymentDto.modality,
          },
        });

        return newPayment;
      });

      return payment;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('El usuario o la inscripción no existen');
      }
      throw error;
    }
  }

  async findAll(
    queryDto: FindPaymentsDto,
  ): Promise<PaginatedResponse<PaymentResponse>> {
    const { page, limit } = queryDto;
    const where = this.buildWhereClause(queryDto);

    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        select: this.paymentSelect,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        totalPages,
        limit,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async findOne(id: string): Promise<PaymentResponse> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      select: this.paymentSelect,
    });

    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponse> {
    try {
      const payment = await this.prisma.$transaction(async (prisma) => {
        const updatedPayment = await prisma.payment.update({
          where: { id },
          data: updatePaymentDto,
          select: this.paymentSelect,
        });

        if (
          updatePaymentDto.startDate ||
          updatePaymentDto.endDate ||
          updatePaymentDto.modality
        ) {
          await prisma.enrollment.update({
            where: { id: updatedPayment.enrollmentId },
            data: {
              ...(updatePaymentDto.startDate && {
                startDate: updatePaymentDto.startDate,
              }),
              ...(updatePaymentDto.endDate && {
                endDate: updatePaymentDto.endDate,
              }),
              ...(updatePaymentDto.modality && {
                modality: updatePaymentDto.modality,
              }),
            },
          });
        }

        return updatedPayment;
      });

      return payment;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Pago con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<PaymentResponse> {
    try {
      return await this.prisma.payment.delete({
        where: { id },
        select: this.paymentSelect,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Pago con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  // async findByUser(userId: string): Promise<PaymentResponse[]> {
  //   return this.prisma.payment.findMany({
  //     where: { userId },
  //     select: this.paymentSelect,
  //     orderBy: { paymentDate: 'desc' },
  //   });
  // }

  // async findByEnrollment(enrollmentId: string): Promise<PaymentResponse[]> {
  //   return this.prisma.payment.findMany({
  //     where: { enrollmentId },
  //     select: this.paymentSelect,
  //     orderBy: { paymentDate: 'desc' },
  //   });
  // }

  async getUserPaymentHistory(userId: string, queryDto: FindPaymentsDto) {
    const { page = 1, limit = 10 } = queryDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const where: Prisma.PaymentWhereInput = {
      enrollment: {
        userId,
      },
      ...(queryDto.startDate && {
        startDate: { gte: new Date(queryDto.startDate) },
      }),
      ...(queryDto.endDate && {
        endDate: { lte: new Date(queryDto.endDate) },
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        select: this.paymentSelect,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      meta: {
        total,
        page,
        totalPages,
        limit,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }
}
