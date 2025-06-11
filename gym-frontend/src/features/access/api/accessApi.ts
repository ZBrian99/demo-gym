import { baseApi } from '../../../api/baseApi';
import { PaginatedResponse } from '../../../types/api.types';
import { Access, AccessFilters } from '../types/access.types';

export const accessApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAccesses: builder.query<PaginatedResponse<Access>, AccessFilters>({
			query: (filters) => ({
				url: '/access-control',
				params: filters,
			}),
			providesTags: ['Accesses'],
		}),
	}),
});

export const {
  useGetAccessesQuery,
} = accessApi; 