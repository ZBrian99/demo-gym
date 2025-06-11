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
