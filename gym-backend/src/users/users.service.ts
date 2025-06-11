import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './types/user.types';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Prisma, Modality } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private userSelect = {
    id: true,
    email: true,
    name: true,
    lastName: true,
    dni: true,
    birthDate: true,
    phone: true,
    role: true,
    active: true,
    createdAt: true,
    updatedAt: true,
    enrollment: {
      select: {
        id: true,
        modality: true,
        startDate: true,
        endDate: true,
        weeklyAccesses: true,
        accesses: {
          orderBy: {
            accessDate: 'desc',
          },
          take: 1,
          select: {
            accessDate: true,
            status: true,
            deniedReason: true,
          },
        },
      },
    },
  } as const;

  private buildWhereClause(filters: FindUsersDto): Prisma.UserWhereInput {
    const {
      search,
      modality,
      status,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
    } = filters;

    const now = dayjs();
    const expiringDate = dayjs().add(7, 'days');
    const todayStart = dayjs().startOf('day');

    let statusCondition: Prisma.UserWhereInput = {};

    if (modality && modality !== 'ALL') {
      statusCondition = {
        enrollment: {
          modality: modality as Modality,
        },
      };
    }

    if (status) {
      switch (status) {
        case 'ACTIVE':
          statusCondition = {
            active: true,
            enrollment: {
              AND: [
                { startDate: { not: null } },
                { endDate: { not: null } },
                { modality: { not: null } },
                { startDate: { lte: now.toDate() } },
                { endDate: { gt: todayStart.toDate() } },
                { endDate: { gt: expiringDate.toDate() } },
                ...(modality && modality !== 'ALL'
                  ? [{ modality: modality as Modality }]
                  : []),
              ],
            },
          };
          break;
        case 'EXPIRING':
          statusCondition = {
            active: true,
            enrollment: {
              AND: [
                { startDate: { not: null } },
                { endDate: { not: null } },
                { modality: { not: null } },
                { endDate: { gte: todayStart.toDate() } },
                { endDate: { lte: expiringDate.toDate() } },
                ...(modality && modality !== 'ALL'
                  ? [{ modality: modality as Modality }]
                  : []),
              ],
            },
          };
          break;
        case 'EXPIRED':
          statusCondition = {
            active: true,
            enrollment: {
              AND: [
                { startDate: { not: null } },
                { endDate: { not: null } },
                { modality: { not: null } },
                { endDate: { lt: todayStart.toDate() } },
                ...(modality && modality !== 'ALL'
                  ? [{ modality: modality as Modality }]
                  : []),
              ],
            },
          };
          break;
        case 'NO_ENROLLMENT':
          statusCondition = {
            OR: [
              { enrollment: null },
              {
                enrollment: {
                  OR: [
                    { startDate: null },
                    { endDate: null },
                    { modality: null },
                  ],
                },
              },
            ],
          };
          break;
        case 'SUSPENDED':
          statusCondition = {
            active: false,
          };
          break;
      }
    }

    return {
      role: 'USER',
      ...statusCondition,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { dni: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(createdFrom && { createdAt: { gte: new Date(createdFrom) } }),
      ...(createdTo && { createdAt: { lte: new Date(createdTo) } }),
      ...(updatedFrom && { updatedAt: { gte: new Date(updatedFrom) } }),
      ...(updatedTo && { updatedAt: { lte: new Date(updatedTo) } }),
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { password, ...userData } = createUserDto;

    try {
      const hashedPassword = password
        ? await this.hashPassword(password)
        : null;

      const user = await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            ...userData,
            password: hashedPassword,
            enrollment: {
              create: {},
            },
          },
          select: this.userSelect,
        });

        return newUser;
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0];
        let message = 'Ya existe un cliente con ';

        switch (target) {
          case 'dni':
            message += 'este DNI';
            break;
          case 'phone':
            message += 'este número de teléfono';
            break;
          case 'email':
            message += 'este correo electrónico';
            break;
          default:
            message = 'Error al crear el cliente';
        }

        throw new ConflictException(message);
      }
      throw error;
    }
  }

  async findAll(
    queryDto: FindUsersDto,
  ): Promise<PaginatedResponse<UserResponse>> {
    const { page, limit, sortBy, sortOrder } = queryDto;
    const where = this.buildWhereClause(queryDto);
    const todayStart = dayjs().startOf('day');
    const expiringDate = dayjs().add(7, 'days');

    let orderBy:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[];

    if (sortBy) {
      switch (sortBy) {
        case 'modality':
          orderBy = {
            enrollment: {
              modality: sortOrder || 'desc',
            },
          };
          break;
        case 'status':
          orderBy = [
            {
              active: sortOrder || 'desc',
            },
            {
              enrollment: {
                endDate: sortOrder || 'desc',
              },
            },
            {
              enrollment: {
                startDate: sortOrder || 'desc',
              },
            },
            {
              enrollment: {
                modality: sortOrder || 'desc',
              },
            },
            {
              createdAt: 'desc',
            },
          ];
          break;
        default:
          orderBy = [{ [sortBy]: sortOrder || 'desc' }, { createdAt: 'desc' }];
      }
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: this.userSelect,
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);

    if (sortBy === 'status') {
      items.sort((a, b) => {
        const getStatusPriority = (user: UserResponse) => {
          if (!user.active) return 5;
          if (
            !user.enrollment?.startDate ||
            !user.enrollment?.endDate ||
            !user.enrollment?.modality
          )
            return 4;
          const endDate = dayjs(user.enrollment.endDate);
          if (endDate.isBefore(todayStart)) return 3;
          if (endDate.isBefore(expiringDate) || endDate.isSame(expiringDate))
            return 2;
          return 1;
        };

        const priorityA = getStatusPriority(a);
        const priorityB = getStatusPriority(b);

        return sortOrder === 'asc'
          ? priorityA - priorityB
          : priorityB - priorityA;
      });
    }

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

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    try {
      const { password, ...userData } = updateUserDto;

      const hashedPassword = password
        ? await this.hashPassword(password)
        : undefined;

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...userData,
          ...(hashedPassword && { password: hashedPassword }),
        },
        select: this.userSelect,
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'El email, DNI o teléfono ya está registrado',
        );
      }
      throw error;
    }
  }

  async remove(id: string, permanent?: boolean): Promise<UserResponse> {
    try {
      if (permanent) {
        return await this.prisma.user.delete({
          where: { id },
          select: this.userSelect,
        });
      }

      return await this.prisma.user.update({
        where: { id },
        data: { active: false },
        select: this.userSelect,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      throw error;
    }
  }

  async checkDni(dni: string): Promise<{ exists: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { dni },
      select: { id: true },
    });

    return { exists: !!user };
  }
}
