import { memo, useState, useCallback, useMemo } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { AccessStatus, Modality } from '../../users/types/enums';
import { AccessFilters, AccessSortableFields } from '../types/access.types';
import { useDebounce } from '../../../hooks/useDebounce';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

interface AccessTableFiltersProps {
	filters: {
		page: number;
		limit: number;
		search?: string;
		modality?: Modality;
		status?: AccessStatus;
		startDate?: string;
		endDate?: string;
		sortBy?: AccessSortableFields;
		sortOrder?: 'asc' | 'desc';
	};
	modality: Modality | 'ALL';
	status: AccessStatus | 'ALL';
	search: string;
	startDate: string | null;
	endDate: string | null;
	sortBy?: AccessSortableFields | undefined;
	sortOrder?: 'asc' | 'desc';
	onModalityChange: (modality: Modality | 'ALL') => void;
	onStatusChange: (status: AccessStatus | 'ALL') => void;
	onSearchChange: (search: string) => void;
	onDateChange: (type: 'startDate' | 'endDate', date: string | null) => void;
	onSortChange: (sort: { field: AccessSortableFields | null; order: 'asc' | 'desc' }) => void;
}

const AccessTableFilters = memo(({ 
	modality = 'ALL', 
	status = 'ALL',
	search = '',
	startDate = null,
	endDate = null,
	sortBy = undefined,
	sortOrder = 'asc',
	onModalityChange,
	onStatusChange,
	onSearchChange,
	onDateChange,
	onSortChange
}: AccessTableFiltersProps) => {
	const [searchValue, setSearchValue] = useState(search);

	const debouncedCallback = useCallback((value: string) => {
		onSearchChange(value);
	}, [onSearchChange]);

	useDebounce(searchValue, debouncedCallback, 300);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	const handleModalityChange = useCallback((event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		onModalityChange(value ? value as Modality : 'ALL');
	}, [onModalityChange]);

	const handleStatusChange = useCallback((event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		onStatusChange(value ? value as AccessStatus : 'ALL');
	}, [onStatusChange]);

	const handleSortChange = useCallback((event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		if (value === '') {
			onSortChange({ field: null, order: 'asc' });
		} else {
			const [field, order] = value.split('-') as [AccessSortableFields, 'asc' | 'desc'];
			onSortChange({ field, order });
		}
	}, [onSortChange]);

	const handleDateChange = useCallback((type: 'startDate' | 'endDate') => (value: any) => {
		const formattedDate = value ? dayjs(value).format('YYYY-MM-DD') : null;
		onDateChange(type, formattedDate);
	}, [onDateChange]);

	const modalityOptions = useMemo(() => [
		{ value: '', label: 'Todas' },
		{ value: Modality.FREE, label: 'Libre' },
		{ value: Modality.THREE, label: '3 veces por semana' },
		{ value: Modality.TWO, label: '2 veces por semana' }
	], []);

	const statusOptions = useMemo(() => [
		{ value: '', label: 'Todos' },
		{ value: AccessStatus.GRANTED, label: 'Permitido' },
		{ value: AccessStatus.DENIED, label: 'Denegado' }
	], []);

	const sortOptions = useMemo(() => [
		{ value: '', label: 'Por defecto' },
		{ value: 'accessDate-desc', label: 'Fecha (Más reciente)' },
		{ value: 'accessDate-asc', label: 'Fecha (Más antiguo)' },
		{ value: 'status-asc', label: 'Estado (A-Z)' },
		{ value: 'status-desc', label: 'Estado (Z-A)' },
		{ value: 'userName-asc', label: 'Nombre (A-Z)' },
		{ value: 'userName-desc', label: 'Nombre (Z-A)' },
		{ value: 'userDni-asc', label: 'DNI (Ascendente)' },
		{ value: 'userDni-desc', label: 'DNI (Descendente)' }
	], []);

	return (
		// <Box
		// 	sx={{
		// 		display: 'flex',
		// 		flexWrap: 'wrap',
		// 		gap: 2,
		// 		width: '100%',
		// 		'& > *': {  // Aplicar a todos los elementos hijos directos
		// 			flex: {
		// 				xs: '1 1 100%',  // En móvil ocupan todo el ancho
		// 				sm: '1 1 15rem', // En desktop tienen un ancho base de 15rem
		// 			},
		// 			minWidth: {
		// 				xs: '100%',
		// 				sm: '15rem',
		// 			},
		// 			maxWidth: {
		// 				xs: '100%',
		// 				sm: '20rem',
		// 			},
		// 		}
		// 	}}
		// >

		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: '1fr', // Móvil: 1 columna
					sm: 'repeat(2, 1fr)', // Tablet: 2 columnas
					md: '2fr 1fr 1fr 1fr', // Desktop: 4 columnas, primera más ancha
				},
				gap: 2,
				width: '100%',
			}}
		>
			<TextField
				size='small'
				label='Buscar por nombre, DNI, teléfono...'
				value={searchValue}
				onChange={handleSearchChange}
				autoComplete='off'
			/>

			<FormControl size='small'>
				<InputLabel id='status-filter-label'>Estado</InputLabel>
				<Select
					labelId='status-filter-label'
					id='status-filter'
					value={status === 'ALL' ? '' : status}
					label='Estado'
					onChange={handleStatusChange}
					MenuProps={{
						disableScrollLock: true,
					}}
				>
					{statusOptions.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl size='small'>
				<InputLabel id='modality-filter-label'>Modalidad</InputLabel>
				<Select
					labelId='modality-filter-label'
					id='modality-filter'
					value={modality === 'ALL' ? '' : modality}
					label='Modalidad'
					onChange={handleModalityChange}
					MenuProps={{
						disableScrollLock: true,
					}}
				>
					{modalityOptions.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* <DesktopDatePicker
				label='Fecha inicio'
				format='DD/MM/YYYY'
				value={startDate ? dayjs(startDate) : null}
				onChange={handleDateChange('startDate')}
				slotProps={{
					textField: {
						size: 'small',
						fullWidth: true,
					},
				}}
			/>

			<DesktopDatePicker
				label='Fecha fin'
				format='DD/MM/YYYY'
				value={endDate ? dayjs(endDate) : null}
				onChange={handleDateChange('endDate')}
				slotProps={{
					textField: {
						size: 'small',
						fullWidth: true,
					},
				}}
			/> */}

			{/* <FormControl size='small'>
				<InputLabel id='sort-filter-label'>Ordenar por</InputLabel>
				<Select
					labelId='sort-filter-label'
					id='sort-filter'
					value={sortBy && sortOrder ? `${sortBy}-${sortOrder}` : ''}
					label='Ordenar por'
					onChange={handleSortChange}
					MenuProps={{
						disableScrollLock: true,
					}}
				>
					{sortOptions.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl> */}
		</Box>
	);
});

export default AccessTableFilters;
