import { FilterParams } from '../../../types/api.types';
import { AccessStatus, Modality } from '../../users/types/enums';

export { AccessStatus, Modality };

export interface AccessUser {
  id: string;
  name: string;
  lastName: string;
  dni: string;
  birthDate?: string;
}

export interface AccessEnrollment {
  modality: Modality | null;
  user: AccessUser;
  remainingAccesses?: number;
}

export interface Access {
  id: string;
  status: AccessStatus;
  accessDate: string;
  deniedReason: string | null;
  enrollment: {
    id: string;
    modality: Modality | null;
    remainingAccesses?: number;
    user: {
      id: string;
      name: string;
      lastName: string;
      dni: string;
      phone: string;
      birthDate?: string;
    };
  };
}

export type AccessSortableFields = 'accessDate' | 'status' | 'modality' | 'userName' | 'userDni';

export interface AccessFilters extends Omit<FilterParams, 'sortBy'> {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  status?: AccessStatus;
  modality?: Modality;
  sortBy?: AccessSortableFields;
} 