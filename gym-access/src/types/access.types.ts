export enum AccessStatus {
  GRANTED = 'GRANTED',
  DENIED = 'DENIED'
}

export enum Modality {
  FREE = 'FREE',
  TWO = 'TWO',
  THREE = 'THREE'
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  dni: string;
  gender: 'M' | 'F';
  birthDate: string;
}

export interface Enrollment {
  modality: Modality;
  weeklyAccesses: number;
  expirationDate: string;
  startDate: string;
  endDate: string;
  user: User;
}

export interface AccessResponse {
  id: string;
  status: AccessStatus;
  accessDate: string;
  deniedReason: string | null;
  enrollment: Enrollment | null;
} 