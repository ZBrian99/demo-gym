import { baseApi } from '../../../api/baseApi';
import { PaginatedResponse } from '../../../types/api.types';
import {
  User,
  UserFilters,
  CreateUserDto,
  UpdateUserDto,
  Enrollment,
  EnrollmentFilters,
  WeeklyAccessesResponse,
  EnrollmentStatusResponse,
  Payment,
  PaymentHistory,
  PaymentHistoryFilters,
  AccessHistory,
  AccessHistoryFilters,
} from '../types/users.types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoints de Usuarios
    getUsers: builder.query<PaginatedResponse<User>, UserFilters>({
      query: (filters) => ({
        url: '/users',
        params: filters,
      }),
      providesTags: ['Users'],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<User, CreateUserDto>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Users',
        { type: 'User', id },
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}?permanent=true`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // Endpoints de Matrículas
    getEnrollments: builder.query<Enrollment[], EnrollmentFilters>({
      query: (filters) => ({
        url: '/enrollments',
        params: filters,
      }),
      providesTags: ['Enrollments'],
    }),

    getEnrollmentById: builder.query<Enrollment, string>({
      query: (id) => `/enrollments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Enrollment', id }],
    }),

    createEnrollment: builder.mutation<
      Enrollment,
      Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'user'>
    >({
      query: (enrollmentData) => ({
        url: '/enrollments',
        method: 'POST',
        body: enrollmentData,
      }),
      invalidatesTags: ['Enrollments'],
    }),

    updateEnrollment: builder.mutation<
      Enrollment,
      { id: string; data: Partial<Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'user'>> }
    >({
      query: ({ id, data }) => ({
        url: `/enrollments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Enrollments',
        { type: 'Enrollment', id },
      ],
    }),

    deleteEnrollment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/enrollments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Enrollments'],
    }),

    getWeeklyAccesses: builder.query<WeeklyAccessesResponse, string>({
      query: (userId) => `/enrollments/${userId}/weekly-accesses`,
      providesTags: (_result, _error, userId) => [{ type: 'Enrollment', id: userId }],
    }),

    getEnrollmentStatus: builder.query<EnrollmentStatusResponse, string>({
      query: (userId) => `/enrollments/${userId}/status`,
      providesTags: (_result, _error, userId) => [{ type: 'Enrollment', id: userId }],
    }),

    createPayment: builder.mutation<Payment, Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (paymentData) => ({
        url: '/payments',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Users', 'Enrollments'],
    }),

    // Nuevos endpoints
    getUserPaymentHistory: builder.query<PaginatedResponse<PaymentHistory>, PaymentHistoryFilters>({
      query: ({ userId, ...filters }) => ({
        url: `/payments/user/${userId}`,
        params: filters,
      }),
      providesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),

    getUserAccessHistory: builder.query<PaginatedResponse<AccessHistory>, AccessHistoryFilters>({
      query: ({ userId, ...filters }) => ({
        url: `/access-control/user/${userId}`,
        params: filters,
      }),
      providesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),
  }),
});

export const {
  // Hooks de Usuarios
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // Hooks de Matrículas
  useGetEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetWeeklyAccessesQuery,
  useGetEnrollmentStatusQuery,
  useCreatePaymentMutation,
  useGetUserPaymentHistoryQuery,
  useGetUserAccessHistoryQuery,
} = usersApi;
