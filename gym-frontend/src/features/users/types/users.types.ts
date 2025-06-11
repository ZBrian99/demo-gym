import { FilterParams } from '../../../types/api.types';
import { Role, Modality, AccessStatus, Currency } from './enums';

// Interfaces para Usuario
export interface User {
  id: string;
  email?: string;
  name: string;
  lastName: string;
  dni: string;
  birthDate?: string;
  phone: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  enrollment?: Enrollment | null;
}
// añadir vencimiento, ultimo acceso, fecha nacimiento, 
export type SortableFields = 'name' | 'lastName' | 'dni' | 'phone' | 'status' | 'modality';

export type SortField = SortableFields | null;

export interface UserFilters extends Omit<FilterParams, 'sortBy'> {
  role?: Role;
  active?: boolean;
  startDate?: Date;
  endDate?: Date;
  modality?: Modality;
  status?: UserStatus;
  search?: string;
  sortBy?: SortableFields;
  sortOrder?: 'asc' | 'desc';
}

export type CreateUserDto = Omit<
  User,
  'id' | 'active' | 'createdAt' | 'updatedAt'
>;

export type UpdateUserDto = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt'>
>;

// Interfaces para Matrícula
export interface Enrollment {
  id: string;
  modality: Modality | null;
  startDate: string | null;
  endDate: string | null;
  accesses: Access[];
  weeklyAccesses: number;
}

export interface EnrollmentFilters {
  search?: string;
  userId?: string;
  modality?: Modality;
  startDate?: Date;
  endDate?: Date;
}

export interface WeeklyAccessesResponse {
  weeklyAccesses: number;
  remainingAccesses: number | null;
}

export interface EnrollmentStatusResponse {
  isActive: boolean;
  message: string;
}

// Interfaces adicionales basadas en el schema
export interface Access {
  accessDate: string;
  status: AccessStatus;
  deniedReason: string | null;
}

export interface Payment {
  id: string;
  enrollmentId: string;
  modality: Modality;
  amount: number;
  currency: Currency;
  startDate: Date;
  endDate: Date;
  comments?: string;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UserStatus = 'ALL' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'NO_ENROLLMENT' | 'SUSPENDED';

// Interfaces para el historial de pagos
export interface PaymentHistory extends Payment {
  user: Pick<User, 'id' | 'name' | 'lastName' | 'dni'>;
}

export interface PaymentHistoryFilters extends FilterParams {
  userId: string;
  startDate?: string;
  endDate?: string;
}

// Interfaces para el historial de accesos
export interface AccessHistory extends Access {
  enrollment: {
    id: string;
    modality: Modality;
    remainingAccesses?: number;
    user: Pick<User, 'id' | 'name' | 'lastName' | 'dni' | 'birthDate'>;
  };
}

export interface AccessHistoryFilters extends FilterParams {
  userId: string;
  startDate?: string;
  endDate?: string;
}
