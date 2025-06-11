import { AccessStatus, Modality } from '@prisma/client';

export interface AccessValidationResponse {
  allowed: boolean;
  enrollment?: {
    id: string;
    modality: Modality;
    startDate: Date;
    endDate: Date;
    weeklyAccesses: number;
    remainingAccesses?: number;
    user?: {
      id: string;
      name: string;
      lastName: string;
      dni: string;
      birthDate: Date;
    };
  };
  deniedReason?: string;
  lastAccess?: {
    accessDate: Date;
    status: AccessStatus;
  };
}

export interface AccessAttemptResponse {
  id: string;
  status: AccessStatus;
  accessDate: Date;
  deniedReason?: string;
  enrollment: {
    modality: Modality;
    startDate: Date;
    endDate: Date;
    weeklyAccesses: number;
    user: {
      id: string;
      name: string;
      lastName: string;
      dni: string;
      birthDate: Date;
    };
  };
}

export interface AccessHistoryResponse {
  id: string;
  accessDate: Date;
  status: AccessStatus;
  deniedReason?: string;
  enrollment: {
    modality: Modality;
    user: {
      id: string;
      name: string;
      lastName: string;
      dni: string;
    };
  };
}

export type AccessSortField =
  | 'accessDate'
  | 'status'
  | 'modality'
  | 'userName'
  | 'userDni';
