import { memo, useState, useCallback, useMemo } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { UserStatus, SortField } from '../types/users.types';
import { Modality } from '../types/enums';
import { useDebounce } from '../../../hooks/useDebounce';

interface UserTableFiltersProps {
	filters: {
		page: number;
		limit: number;
		search?: string;
		modality?: Modality;
		status?: UserStatus;
		sortBy?: SortField;
		sortOrder?: 'asc' | 'desc';
	};
	modality: Modality | 'ALL';
	status: UserStatus;
	search: string;
	sortBy?: SortField;
	sortOrder?: 'asc' | 'desc';
	onModalityChange: (modality: Modality | 'ALL') => void;
	onStatusChange: (status: UserStatus) => void;
	onSearchChange: (search: string) => void;
	onSortChange: (sort: { field: SortField; order: 'asc' | 'desc' }) => void;
}

const UserTableFilters = memo(
	({
		modality = 'ALL',
		status = 'ALL',
		search = '',
		sortBy = null,
		sortOrder = 'asc',
		onModalityChange,
		onStatusChange,
		onSearchChange,
		onSortChange,
	}: UserTableFiltersProps) => {
		const [searchValue, setSearchValue] = useState(search);

		const debouncedCallback = useCallback(
			(value: string) => {
				onSearchChange(value);
			},
			[onSearchChange]
		);

		useDebounce(searchValue, debouncedCallback, 300);

		const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			setSearchValue(event.target.value);
		};

		const handleModalityChange = useCallback(
			(event: SelectChangeEvent<string>) => {
				const value = event.target.value;
				onModalityChange(value ? (value as Modality) : 'ALL');
			},
			[onModalityChange]
		);

		const handleStatusChange = useCallback(
			(event: SelectChangeEvent<string>) => {
				const value = event.target.value;
				onStatusChange(value ? (value as UserStatus) : 'ALL');
			},
			[onStatusChange]
		);

		const handleSortChange = useCallback(
			(event: SelectChangeEvent<string>) => {
				const value = event.target.value;
				if (value === '') {
					onSortChange({ field: null, order: 'asc' });
				} else {
					const [field, order] = value.split('-') as [SortField, 'asc' | 'desc'];
					onSortChange({ field, order });
				}
			},
			[onSortChange]
		);

		const modalityOptions = useMemo(
			() => [
				{ value: '', label: 'Todas' },
				{ value: Modality.FREE, label: 'Libre' },
				{ value: Modality.THREE, label: '3 veces por semana' },
				{ value: Modality.TWO, label: '2 veces por semana' },
			],
			[]
		);

		const statusOptions = useMemo(
			() => [
				{ value: '', label: 'Todos' },
				{ value: 'ACTIVE', label: 'Al día' },
				{ value: 'EXPIRING', label: 'Por vencer' },
				{ value: 'EXPIRED', label: 'Vencido' },
				{ value: 'NO_ENROLLMENT', label: 'Sin inscripción' },
				{ value: 'SUSPENDED', label: 'Suspendido' },
			],
			[]
		);

		const sortOptions = useMemo(
			() => [
				{ value: '', label: 'Por defecto' },
				{ value: 'name-asc', label: 'Nombre (A-Z)' },
				{ value: 'name-desc', label: 'Nombre (Z-A)' },
				{ value: 'lastName-asc', label: 'Apellido (A-Z)' },
				{ value: 'lastName-desc', label: 'Apellido (Z-A)' },
				{ value: 'dni-asc', label: 'DNI (Ascendente)' },
				{ value: 'dni-desc', label: 'DNI (Descendente)' },
				{ value: 'phone-asc', label: 'Teléfono (Ascendente)' },
				{ value: 'phone-desc', label: 'Teléfono (Descendente)' },
				{ value: 'status-asc', label: 'Estado (A-Z)' },
				{ value: 'status-desc', label: 'Estado (Z-A)' },
			],
			[]
		);

		return (
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
	}
);

export default UserTableFilters;
