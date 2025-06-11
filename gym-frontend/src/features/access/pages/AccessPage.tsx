import { useState, useCallback, useEffect } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useGetAccessesQuery } from '../api/accessApi';
import { useAppDispatch } from '../../../app/hooks';
import { showSnackbar } from '../../../app/appSlice';
import AccessTable from '../components/AccessTable';
import AccessTableFilters from '../components/AccessTableFilters';
import TablePagination from '../../../components/table/TablePagination';
import { AccessFilters, AccessSortableFields, AccessStatus, Modality } from '../types/access.types';

const AccessPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // const getValidatedParams = useCallback((totalPages?: number) => {
  //   const page = Number(searchParams.get('page')) || 1;
  //   const limit = Number(searchParams.get('limit')) || 20;
    
  //   const validLimit = [20, 50, 100].includes(limit) ? limit : 20;
  //   let validPage = Math.max(1, page);

  //   if (totalPages) {
  //     validPage = Math.min(validPage, totalPages);
  //   }
    
  //   return {
  //     page: validPage,
  //     limit: validLimit
  //   };
  // }, [searchParams]);

  const [filters, setFilters] = useState<AccessFilters>({
		page: 1,
		limit: 20,
		search: undefined,
		status: undefined,
		modality: undefined,
		startDate: undefined,
		endDate: undefined,
		sortBy: undefined,
		sortOrder: undefined,
	});

  const [localFilters, setLocalFilters] = useState({
    search: '',
    status: 'ALL' as AccessStatus | 'ALL',
    modality: 'ALL' as Modality | 'ALL',
    startDate: null as string | null,
    endDate: null as string | null,
    sortBy: undefined as AccessSortableFields | undefined,
    sortOrder: 'asc' as 'asc' | 'desc',
  });

  const handleSearchChange = useCallback((search: string) => {
    setLocalFilters(prev => ({ ...prev, search }));
    setFilters(prev => ({
      ...prev,
      search: search || undefined,
      page: 1,
    }));
  }, []);

  const handleStatusChange = useCallback((status: AccessStatus | 'ALL') => {
    setLocalFilters(prev => ({ ...prev, status }));
    setFilters(prev => ({
      ...prev,
      status: status === 'ALL' ? undefined : status,
      page: 1,
    }));
  }, []);

  const handleModalityChange = useCallback((modality: Modality | 'ALL') => {
    setLocalFilters(prev => ({ ...prev, modality }));
    setFilters(prev => ({
      ...prev,
      modality: modality === 'ALL' ? undefined : modality,
      page: 1,
    }));
  }, []);

  const handleDateChange = useCallback((type: 'startDate' | 'endDate', date: string | null) => {
    setLocalFilters(prev => ({ ...prev, [type]: date }));
    setFilters(prev => ({
      ...prev,
      [type]: date || undefined,
      page: 1,
    }));
  }, []);

  const handleSortChange = useCallback(({ field, order }: { field: AccessSortableFields | null; order: 'asc' | 'desc' }) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      sortBy: field || undefined,
      sortOrder: order 
    }));
    setFilters(prev => ({
      ...prev,
      sortBy: field || undefined,
      sortOrder: field ? order : undefined,
      page: 1,
    }));
  }, []);

  const { data, isLoading, error } = useGetAccessesQuery(filters);

  const dispatch = useAppDispatch();

  const handleFilterChange = useCallback((newFilters: Partial<AccessFilters>) => {
    // const params = new URLSearchParams();
    
    // Solo incluir page y limit en la URL
    // params.set('page', String(newFilters.page || 1));
    // params.set('limit', String(newFilters.limit || 20));
    // setSearchParams(params, { replace: true });

    // Limpiar valores por defecto antes de actualizar
    const cleanedFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (
        value === '' || 
        value === undefined || 
        (key === 'sortBy' && value === null) ||
        (key === 'search' && value === '')
      ) {
        return acc;
      }
      return { ...acc, [key]: value };
    }, {});

    setFilters(prev => ({
      ...prev,
      ...cleanedFilters,
      page: newFilters.page || 1,
      limit: newFilters.limit || 20
    }));
  }, [setSearchParams]);

  // Sincronizar con URL solo para page y limit
  // useEffect(() => {
  //   const urlParams = getValidatedParams();
  //   if (urlParams.page !== filters.page || urlParams.limit !== filters.limit) {
  //     setFilters(prev => ({
  //       ...prev,
  //       ...urlParams
  //     }));
  //   }
  // }, [searchParams, getValidatedParams, filters.page, filters.limit]);

  // Efecto para manejar cambios en la respuesta
  useEffect(() => {
    if (data) {
      // const validatedParams = getValidatedParams(data.meta.totalPages);
      
      // if (
      //   validatedParams.page !== filters.page || 
      //   validatedParams.limit !== filters.limit ||
      //   (filters.page > data.meta.totalPages && data.meta.totalPages > 0)
      // ) {
        setFilters(prev => ({
          ...prev,
          // ...validatedParams,
          // page: Math.min(validatedParams.page, data.meta.totalPages || 1)
          page: filters.page,
          limit: filters.limit,
        }));
      // }
    }
  }, [data, filters.page, filters.limit]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [filters]);

  return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 2, px: 1.5, flexGrow: 1 }}>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent='space-between'
				alignItems={{ xs: 'flex-start', sm: 'center' }}
				spacing={2}
			>
				<Typography
					variant='h3'
					sx={{
						fontSize: {
							xs: '1.5rem',
							sm: '2rem',
						},
						whiteSpace: 'nowrap',
					}}
				>
					Control de Accesos
				</Typography>
			</Stack>

			<AccessTableFilters
				filters={{
					page: filters.page,
					limit: filters.limit,
					search: filters.search,
					modality: filters.modality,
					status: filters.status,
					startDate: filters.startDate,
					endDate: filters.endDate,
					sortBy: filters.sortBy,
					sortOrder: filters.sortOrder,
				}}
				modality={localFilters.modality}
				status={localFilters.status}
				search={localFilters.search}
				startDate={localFilters.startDate}
				endDate={localFilters.endDate}
				sortBy={localFilters.sortBy}
				sortOrder={localFilters.sortOrder}
				onModalityChange={handleModalityChange}
				onStatusChange={handleStatusChange}
				onSearchChange={handleSearchChange}
				onDateChange={handleDateChange}
				onSortChange={handleSortChange}
			/>

			<AccessTable accesses={data?.items || []} isLoading={isLoading} error={error} />

			{data && data.items.length > 0 && (
				<TablePagination
					page={filters.page || 1}
					limit={filters.limit || 20}
					totalPages={data.meta.totalPages}
					onPageChange={(newPage) => handleFilterChange({ ...filters, page: newPage })}
					onLimitChange={(newLimit) => handleFilterChange({ ...filters, limit: newLimit, page: 1 })}
				/>
			)}
		</Box>
	);
};

export default AccessPage; 