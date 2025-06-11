import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AccessValidationResponse,
  AccessAttemptResponse,
  AccessHistoryResponse,
} from './types/access-control.types';
import { AccessStatus } from '@prisma/client';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FindAccessDto } from './dto/find-access.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Prisma } from '@prisma/client';

// Extendemos dayjs con los plugins necesarios
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

// Establecemos la zona horaria de Argentina
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');

@Injectable()
export class AccessControlService {
  constructor(private prisma: PrismaService) {}

  private readonly ADMIN_KEY = process.env.ADMIN_KEY || '11223344';
  private readonly MIN_TIME_BETWEEN_ACCESSES = Number(
    process.env.MIN_TIME_BETWEEN_ACCESSES,
  );

  // DNIs de prueba para demo
  private readonly DEMO_USERS = {
    ADMIN: '11223344',
    ACTIVE_USER: '12345678',
    BIRTHDAY_USER: '23456789',
    THREE_DAY_USER: '34567890',
    NO_ACCESS_USER: '90123456',
    EXPIRING_SOON_5_USER: '67890123',
    EXPIRING_TOMORROW_USER: '78901234',
    EXPIRED_USER: '45678901',
    SUSPENDED_USER: '56789012',
  };

  private shouldResetWeeklyAccesses(lastReset: Date): boolean {
    const lastResetDate = dayjs(lastReset).tz();
    const now = dayjs().tz();
    return (
      now.startOf('day').isoWeek() !== lastResetDate.startOf('day').isoWeek() &&
      now.isoWeekday() >= 1
    );
  }

  async validateAccess(dni: string): Promise<AccessValidationResponse> {
    // Caso Admin Key
    if (dni === this.DEMO_USERS.ADMIN) {
      return {
        allowed: true,
        enrollment: {
          id: 'admin',
          modality: 'FREE',
          startDate: new Date(),
          endDate: new Date(),
          weeklyAccesses: 0,
          remainingAccesses: undefined,
          user: {
            id: 'admin',
            name: 'Admin',
            lastName: 'System',
            dni: this.DEMO_USERS.ADMIN,
            birthDate: null,
          },
        },
      };
    }

    // Para la demo, interceptamos los DNIs de prueba
    if (Object.values(this.DEMO_USERS).includes(dni)) {
      return this.handleDemoUser(dni);
    }

    const now = dayjs().tz();

    // Una sola consulta para obtener usuario, enrollment y último acceso
    const user = await this.prisma.user.findUnique({
      where: { dni },
      select: {
        id: true,
        name: true,
        lastName: true,
        dni: true,
        birthDate: true,
        active: true,
        enrollment: {
          select: {
            id: true,
            modality: true,
            startDate: true,
            endDate: true,
            weeklyAccesses: true,
            lastAccessReset: true,
            accesses: {
              orderBy: { accessDate: 'desc' },
              take: 1,
              select: {
                accessDate: true,
                status: true,
              },
            },
          },
        },
      },
    });

    // Caso: Usuario no existe
    if (!user) {
      return {
        allowed: false,
        deniedReason: 'Usuario no encontrado',
      };
    }

    // Caso: No tiene enrollment (no debería ocurrir)
    if (!user.enrollment) {
      return {
        allowed: false,
        deniedReason: 'No tiene una inscripción',
      };
    }

    const enrollment = user.enrollment;
    const lastAccess = enrollment.accesses[0];

    // Caso: Usuario inactivo
    if (!user.active) {
      return {
        allowed: false,
        enrollment,
        deniedReason: 'Usuario no activo',
      };
    }

    // Caso: Sin modalidad o fechas (inscripción inválida)
    if (!enrollment.modality || !enrollment.startDate || !enrollment.endDate) {
      return {
        allowed: false,
        enrollment,
        deniedReason: 'No tiene una inscripción activa',
      };
    }

    // Caso: Fuera de fecha
    if (
      now.endOf('day').isBefore(enrollment.startDate) ||
      now.startOf('day').isAfter(enrollment.endDate)
    ) {
      return {
        allowed: false,
        enrollment,
        deniedReason: 'Fuera del período de inscripción',
      };
    }

    // Reset semanal si corresponde
    if (this.shouldResetWeeklyAccesses(enrollment.lastAccessReset)) {
      await this.prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          weeklyAccesses: 0,
          lastAccessReset: now.startOf('isoWeek').toDate(),
        },
      });
      enrollment.weeklyAccesses = 0;
    }

    // Validación de accesos según modalidad
    let allowed = true;
    let deniedReason: string | undefined;
    let remainingAccesses: number | undefined;

    if (enrollment.modality !== 'FREE') {
      const maxAccesses = enrollment.modality === 'THREE' ? 3 : 2;
      remainingAccesses = maxAccesses - enrollment.weeklyAccesses;

      if (lastAccess) {
        const minutesSinceLastAccess = now.diff(
          dayjs(lastAccess.accessDate).tz(),
          'minute',
        );

        if (minutesSinceLastAccess < this.MIN_TIME_BETWEEN_ACCESSES) {
          allowed = true;
        } else if (enrollment.weeklyAccesses >= maxAccesses) {
          allowed = false;
          deniedReason = `Ha alcanzado el límite de ${maxAccesses} accesos semanales`;
        }
      }
    }

    return {
      allowed,
      enrollment: {
        ...enrollment,
        remainingAccesses,
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          dni: user.dni,
          birthDate: user.birthDate,
        },
      },
      deniedReason,
      lastAccess,
    };
  }

  private handleDemoUser(dni: string): AccessValidationResponse {
    const now = dayjs().tz();

    switch (dni) {
      case this.DEMO_USERS.ACTIVE_USER:
        return {
          allowed: true,
          enrollment: {
            id: 'demo-active',
            modality: 'FREE',
            startDate: now.subtract(1, 'month').toDate(),
            endDate: now.add(1, 'month').toDate(),
            weeklyAccesses: 0,
            user: {
              id: 'demo-active',
              name: 'Valentina',
              lastName: 'González',
              dni,
              birthDate: now.add(1, 'month').subtract(25, 'year').toDate(),
            },
          },
        };

      case this.DEMO_USERS.BIRTHDAY_USER:
        return {
          allowed: true,
          enrollment: {
            id: 'demo-birthday',
            modality: 'TWO',
            startDate: now.subtract(1, 'month').toDate(),
            endDate: now.add(1, 'month').toDate(),
            weeklyAccesses: 1,
            remainingAccesses: 1,
            user: {
              id: 'demo-birthday',
              name: 'Martina',
              lastName: 'Rodríguez',
              dni,
              birthDate: now.toDate(),
            },
          },
        };

      case this.DEMO_USERS.THREE_DAY_USER:
        return {
          allowed: true,
          enrollment: {
            id: 'demo-three',
            modality: 'THREE',
            startDate: now.subtract(1, 'month').toDate(),
            endDate: now.add(1, 'month').toDate(),
            weeklyAccesses: 1,
            remainingAccesses: 2,
            user: {
              id: 'demo-three',
              name: 'Nicolás',
              lastName: 'Pereyra',
              dni,
              birthDate: now.add(1, 'month').subtract(28, 'year').toDate(),
            },
          },
        };

      case this.DEMO_USERS.EXPIRED_USER:
        return {
          allowed: false,
          deniedReason: 'Fuera del período de inscripción',
          enrollment: {
            id: 'demo-expired',
            modality: 'TWO',
            startDate: now.subtract(2, 'month').toDate(),
            endDate: now.subtract(1, 'month').toDate(),
            weeklyAccesses: 0,
            user: {
              id: 'demo-expired',
              name: 'Florencia',
              lastName: 'Aguirre',
              dni,
              birthDate: now.add(1, 'month').subtract(35, 'year').toDate(),
            },
          },
        };

      case this.DEMO_USERS.SUSPENDED_USER:
        return {
          allowed: false,
          deniedReason: 'Usuario no activo',
          enrollment: {
            id: 'demo-suspended',
            modality: 'TWO',
            startDate: now.subtract(1, 'month').toDate(),
            endDate: now.add(1, 'month').toDate(),
            weeklyAccesses: 0,
            user: {
              id: 'demo-suspended',
              name: 'Luciano',
              lastName: 'Sosa',
              dni,
              birthDate: now.add(1, 'month').subtract(40, 'year').toDate(),
            },
          },
        };

      case this.DEMO_USERS.EXPIRING_SOON_5_USER:
        return {
          allowed: true,
          enrollment: {
            id: 'demo-expiring-soon-5',
            modality: 'TWO',
            startDate: now.subtract(1, 'month').toDate(),
            endDate: now.add(5, 'day').toDate(),
            weeklyAccesses: 1,
            remainingAccesses: 1,
            user: {
              id: 'demo-expiring-soon-5',
              name: 'Camila',
              lastName: 'Fernández',
              dni,
              birthDate: now.add(1, 'month').subtract(27, 'year').toDate(),
            },
          },
        };

      case this.DEMO_USERS.EXPIRING_TOMORROW_USER:
        return {
          allowed: true,
          enrollment: {
            id: 'demo-expiring-tomorrow',
            modality: 'TWO',
            startDate: now.subtract(1, 'month').toDate(),
            endDate: now.add(1, 'day').toDate(),
            weeklyAccesses: 0,
            remainingAccesses: 2,
            user: {
              id: 'demo-expiring-tomorrow',
              name: 'Sebastián',
              lastName: 'Giménez',
              dni,
              birthDate: now.add(1, 'month').subtract(32, 'year').toDate(),
            },
          },
        };

      case this.DEMO_USERS.NO_ACCESS_USER:
        return {
          allowed: false,
          deniedReason: 'No quedan accesos semanales',
          enrollment: {
            id: 'demo-no-access',
            modality: 'TWO',
            startDate: now.subtract(1, 'month').toDate(),
            endDate: now.add(1, 'month').toDate(),
            weeklyAccesses: 3,
            remainingAccesses: 0,
            user: {
              id: 'demo-no-access',
              name: 'Antonella',
              lastName: 'Acosta',
              dni,
              birthDate: now.add(1, 'month').subtract(30, 'year').toDate(),
            },
          },
        };

      default:
        return {
          allowed: false,
          deniedReason: 'Usuario no encontrado',
        };
    }
  }

  async registerAccess(dni: string): Promise<AccessAttemptResponse> {
    // Caso Admin Key
    if (dni === this.ADMIN_KEY) {
      return {
        id: 'admin',
        status: AccessStatus.GRANTED,
        accessDate: new Date(),
        deniedReason: null,
        enrollment: {
          modality: 'FREE',
          weeklyAccesses: 0,
          startDate: null,
          endDate: null,
          user: {
            id: 'admin',
            name: 'Admin',
            lastName: 'System',
            dni: '00000000',
            birthDate: null,
          },
        },
      };
    }

    // Para usuarios demo, generamos una respuesta simulada
    if (Object.values(this.DEMO_USERS).includes(dni)) {
      const demoValidation = this.handleDemoUser(dni);
      const now = dayjs().tz().toDate();

      // Si no hay enrollment, retornamos acceso denegado
      if (!demoValidation.enrollment) {
        return {
          id: `demo-${dni}`,
          status: AccessStatus.DENIED,
          accessDate: now,
          deniedReason:
            demoValidation.deniedReason || 'No hay inscripción activa',
          enrollment: null,
        };
      }

      // Construimos la respuesta con la estructura correcta del enrollment
      return {
        id: demoValidation.enrollment.id,
        status: demoValidation.allowed
          ? AccessStatus.GRANTED
          : AccessStatus.DENIED,
        accessDate: now,
        deniedReason: demoValidation.deniedReason || null,
        enrollment: {
          modality: demoValidation.enrollment.modality,
          weeklyAccesses: demoValidation.enrollment.weeklyAccesses,
          startDate: demoValidation.enrollment.startDate,
          endDate: demoValidation.enrollment.endDate,
          user: demoValidation.enrollment.user,
        },
      };
    }

    const validation = await this.validateAccess(dni);

    // Si no hay enrollment, no registramos nada
    if (!validation.enrollment) {
      return {
        id: 'no-enrollment',
        status: AccessStatus.DENIED,
        accessDate: dayjs().tz().toDate(),
        deniedReason: validation.deniedReason,
        enrollment: null,
      };
    }

    // Actualizamos weeklyAccesses si corresponde
    if (
      validation.allowed &&
      validation.enrollment?.modality !== 'FREE' &&
      (!validation.lastAccess ||
        dayjs()
          .tz()
          .diff(dayjs(validation.lastAccess.accessDate).tz(), 'minute') >=
          this.MIN_TIME_BETWEEN_ACCESSES)
    ) {
      try {
        await this.prisma.enrollment.update({
          where: { id: validation.enrollment.id },
          data: {
            weeklyAccesses: {
              increment: 1,
            },
          },
        });
      } catch {
        // Si falla la actualización del contador, denegamos el acceso
        return {
          id: 'error',
          status: AccessStatus.DENIED,
          accessDate: dayjs().tz().toDate(),
          deniedReason: 'Error al actualizar',
          enrollment: null,
        };
      }
    }

    // Registramos el acceso en una transacción para asegurar consistencia
    try {
      const result = await this.prisma.access.create({
        data: {
          enrollmentId: validation.enrollment.id,
          status: validation.allowed
            ? AccessStatus.GRANTED
            : AccessStatus.DENIED,
          deniedReason: validation.deniedReason,
          accessDate: dayjs().tz().toDate(),
        },
        select: {
          id: true,
          status: true,
          accessDate: true,
          deniedReason: true,
          enrollment: {
            select: {
              modality: true,
              weeklyAccesses: true,
              startDate: true,
              endDate: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  lastName: true,
                  dni: true,
                  birthDate: true,
                },
              },
            },
          },
        },
      });

      if (result.status === AccessStatus.GRANTED) {
        // this.accessControlGateway.sendOpenSignal();
      }

      return result;
    } catch {
      // Si falla el registro del acceso
      return {
        id: 'error',
        status: AccessStatus.DENIED,
        accessDate: dayjs().tz().toDate(),
        deniedReason: 'Error al registrar',
        enrollment: null,
      };
    }
  }

  private buildWhereClause(filters: FindAccessDto): Prisma.AccessWhereInput {
    const { search, status, startDate, endDate, modality } = filters;

    return {
      ...(status && { status }),
      ...(startDate && {
        accessDate: { gte: new Date(startDate) },
      }),
      ...(endDate && {
        accessDate: { lte: new Date(endDate) },
      }),
      ...(modality && {
        enrollment: {
          modality,
        },
      }),
      ...(search && {
        OR: [
          {
            enrollment: {
              user: {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { lastName: { contains: search, mode: 'insensitive' } },
                  { dni: { contains: search, mode: 'insensitive' } },
                  { phone: { contains: search, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      }),
    };
  }

  async findAll(
    queryDto: FindAccessDto,
  ): Promise<PaginatedResponse<AccessHistoryResponse>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = queryDto;
    const where = this.buildWhereClause(queryDto);

    let orderBy:
      | Prisma.AccessOrderByWithRelationInput
      | Prisma.AccessOrderByWithRelationInput[];

    if (sortBy) {
      switch (sortBy) {
        case 'userName':
          orderBy = [
            {
              enrollment: {
                user: {
                  name: sortOrder || 'desc',
                },
              },
            },
            { accessDate: 'desc' },
          ];
          break;
        case 'userDni':
          orderBy = [
            {
              enrollment: {
                user: {
                  dni: sortOrder || 'desc',
                },
              },
            },
            { accessDate: 'desc' },
          ];
          break;
        case 'modality':
          orderBy = [
            {
              enrollment: {
                modality: sortOrder || 'desc',
              },
            },
            { accessDate: 'desc' },
          ];
          break;
        default:
          orderBy = [{ [sortBy]: sortOrder || 'desc' }, { accessDate: 'desc' }];
      }
    } else {
      orderBy = { accessDate: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.access.findMany({
        where,
        select: {
          id: true,
          accessDate: true,
          status: true,
          deniedReason: true,
          enrollment: {
            select: {
              modality: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  lastName: true,
                  dni: true,
                  phone: true,
                },
              },
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
      }),
      this.prisma.access.count({ where }),
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

  async getAccessHistory(
    userId: string,
    queryDto: FindAccessDto,
  ): Promise<PaginatedResponse<AccessHistoryResponse>> {
    const { page = 1, limit = 10, sortBy, sortOrder } = queryDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const baseWhere = this.buildWhereClause(queryDto);
    const where: Prisma.AccessWhereInput = {
      ...baseWhere,
      enrollment: {
        is: {
          userId,
          ...(baseWhere.enrollment?.is || {}),
        },
      },
    };

    let orderBy:
      | Prisma.AccessOrderByWithRelationInput
      | Prisma.AccessOrderByWithRelationInput[];

    if (sortBy) {
      switch (sortBy) {
        case 'userName':
        case 'userDni':
          // Para un usuario específico no tiene sentido ordenar por nombre o dni
          orderBy = { accessDate: 'desc' };
          break;
        case 'modality':
          orderBy = [
            {
              enrollment: {
                modality: sortOrder || 'desc',
              },
            },
            { accessDate: 'desc' },
          ];
          break;
        default:
          orderBy = [{ [sortBy]: sortOrder || 'desc' }, { accessDate: 'desc' }];
      }
    } else {
      orderBy = { accessDate: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.access.findMany({
        where,
        select: {
          id: true,
          accessDate: true,
          status: true,
          deniedReason: true,
          enrollment: {
            select: {
              modality: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  lastName: true,
                  dni: true,
                },
              },
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy,
      }),
      this.prisma.access.count({ where }),
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
