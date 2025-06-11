import { Modality } from '@prisma/client';

export interface Enrollment {
  id: string;
  userId: string;
  modality: Modality;
  startDate: Date;
  endDate: Date;
  comments?: string;
  weeklyAccesses: number;
  lastAccessReset: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrollmentFilters {
  search?: string;
  userId?: string;
  modality?: Modality;
  startDate?: Date;
  endDate?: Date;
}

export interface EnrollmentResponse {
  id: string;
  userId: string;
  modality: Modality;
  startDate: Date;
  endDate: Date;
  weeklyAccesses: number;
  lastAccessReset: Date;
  comments?: string;
  user?: {
    name: string;
    lastName: string;
    dni: string;
  };
}

export interface WeeklyAccessesResponse {
  weeklyAccesses: number;
  remainingAccesses: number | null;
}

export interface EnrollmentStatusResponse {
  isActive: boolean;
  message: string;
}
