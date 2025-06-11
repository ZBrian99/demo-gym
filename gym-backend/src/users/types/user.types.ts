import { User, Enrollment, Access, Modality } from '@prisma/client';

type LastAccess = Pick<Access, 'accessDate' | 'status' | 'deniedReason'>;
type EnrollmentInfo = Pick<
  Enrollment,
  'id' | 'modality' | 'startDate' | 'endDate'
> & {
  accesses: LastAccess[];
};

export type UserResponse = Omit<User, 'password'> & {
  enrollment?: EnrollmentInfo | null;
};

export type SortField =
  | 'name'
  | 'lastName'
  | 'dni'
  | 'phone'
  | 'status'
  | 'modality';

export type UserStatus =
  | 'ALL'
  | 'ACTIVE'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'NO_ENROLLMENT'
  | 'SUSPENDED';

export interface UserFilters {
  modality?: Modality | 'ALL';
  status?: UserStatus;
  search?: string;
  sortBy?: SortField;
  sortOrder?: 'asc' | 'desc';
}
