export interface PaginationParams {
	page?: number;
	limit?: number;
}

export interface PaginatedResponse<T> {
	items: T[];
	meta: {
		total: number;
		page: number;
		totalPages: number;
		limit: number;
		
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	};
}

export interface FilterParams extends PaginationParams {
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}
