import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { FindEnrollmentsDto } from './dto/find-enrollments.dto';
import {
  EnrollmentResponse,
  WeeklyAccessesResponse,
  EnrollmentStatusResponse,
} from './types/enrollment.types';
import { Prisma } from '@prisma/client';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import dayjs from 'dayjs';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly enrollmentSelect = {
    id: true,
    userId: true,
    modality: true,
    startDate: true,
    endDate: true,
    comments: true,
    weeklyAccesses: true,
    lastAccessReset: true,
    user: {
      select: {
        name: true,
        lastName: true,
        dni: true,
      },
    },
  };

  private buildWhereClause(
    filters: FindEnrollmentsDto,
  ): Prisma.EnrollmentWhereInput {
    const { search, userId, modality, startDate, endDate } = filters;

    return {
      ...(userId && { userId }),
      ...(modality && { modality }),
      ...(startDate && { startDate: { gte: new Date(startDate) } }),
      ...(endDate && { endDate: { lte: new Date(endDate) } }),
      ...(search && {
        OR: [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { lastName: { contains: search, mode: 'insensitive' } } },
          { user: { dni: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };
  }

  async create(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentResponse> {
    try {
      const enrollment = await this.prisma.enrollment.create({
        data: createEnrollmentDto,
        select: this.enrollmentSelect,
      });

      return enrollment;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('La inscripción ya existe');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('El usuario no existe');
      }
      throw error;
    }
  }

  async findAll(
    queryDto: FindEnrollmentsDto,
  ): Promise<PaginatedResponse<EnrollmentResponse>> {
    const { page, limit } = queryDto;
    const where = this.buildWhereClause(queryDto);

    const [items, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        select: this.enrollmentSelect,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.enrollment.count({ where }),
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

  async findOne(id: string): Promise<EnrollmentResponse> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      select: this.enrollmentSelect,
    });

    if (!enrollment) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return enrollment;
  }

  async findByUser(userId: string): Promise<EnrollmentResponse[]> {
    return this.prisma.enrollment.findMany({
      where: {
        userId,
      },
      select: this.enrollmentSelect,
    });
  }

  async update(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponse> {
    try {
      const enrollment = await this.prisma.enrollment.update({
        where: { id },
        data: updateEnrollmentDto,
        select: this.enrollmentSelect,
      });

      return enrollment;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<EnrollmentResponse> {
    try {
      return await this.prisma.enrollment.delete({
        where: { id },
        select: this.enrollmentSelect,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
      }
      throw error;
    }
  }

  async checkStatus(id: string): Promise<EnrollmentStatusResponse> {
    const enrollment = await this.findOne(id);

    const now = dayjs();
    const isExpired = now.isAfter(enrollment.endDate);
    const isActive = !isExpired;

    return {
      isActive,
      message: isActive ? 'Inscripción activa' : 'Inscripción expirada',
    };
  }

  async getWeeklyAccesses(id: string): Promise<WeeklyAccessesResponse> {
    const enrollment = await this.findOne(id);

    // Resetear contador semanal si ha pasado una semana
    const lastReset = dayjs(enrollment.lastAccessReset);
    const now = dayjs();
    const weeksPassed = now.diff(lastReset, 'week');

    if (weeksPassed >= 1) {
      await this.prisma.enrollment.update({
        where: { id },
        data: {
          weeklyAccesses: 0,
          lastAccessReset: now.toDate(),
        },
      });

      return {
        weeklyAccesses: 0,
        remainingAccesses:
          enrollment.modality === 'FREE'
            ? null
            : enrollment.modality === 'THREE'
              ? 3
              : 2,
      };
    }

    const remainingAccesses =
      enrollment.modality === 'FREE'
        ? null
        : enrollment.modality === 'THREE'
          ? 3 - enrollment.weeklyAccesses
          : 2 - enrollment.weeklyAccesses;

    return {
      weeklyAccesses: enrollment.weeklyAccesses,
      remainingAccesses,
    };
  }
}
