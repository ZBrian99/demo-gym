import { Currency, Modality } from '@prisma/client';

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
  enrollment?: {
    modality: Modality;
    user: {
      name: string;
      lastName: string;
      dni: string;
    };
  };
}

export interface PaymentResponse {
  id: string;
  enrollmentId: string;
  modality: Modality;
  amount: number;
  currency: Currency;
  startDate: Date;
  endDate: Date;
  comments?: string;
  discount?: number;
  enrollment?: {
    modality: Modality;
    user: {
      name: string;
      lastName: string;
      dni: string;
    };
  };
}

export interface PaymentFilters {
  search?: string;
  enrollmentId?: string;
  currency?: Currency;
  startDate?: Date;
  endDate?: Date;
}
