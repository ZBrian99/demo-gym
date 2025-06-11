import { useMemo, memo, useCallback, useReducer, useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow as MuiTableRow,
	Paper,
	IconButton,
	Tooltip,
	Box,
	Typography,
} from '@mui/material';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	Row,
} from '@tanstack/react-table';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User,  UserStatus, SortField, SortableFields } from '../types/users.types';
import { useGetUsersQuery } from '../api/usersApi';
import { AccessStatus, Modality } from '../types/enums';
import { formatDate, formatDateTime } from '../../../utils/dateUtils';
import UserActionsMenu from './UserActionsMenu';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import LoadingScreen from '../../../components/common/LoadingScreen';
// import UserTableFilters from './UserTableFilters';
import TablePagination from '../../../components/table/TablePagination';
import UserTableFilters from './UserTableFilters';
// import TableFilters, { UserStatus } from '../../../components/table/TableFilters';

// Inicializamos los plugins de dayjs

const columnHelper = createColumnHelper<User>();

interface UsersTableProps {
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
	onAddPayment: (user: User) => void;
}

const AccessStatusIcon = memo(({ status }: { status: AccessStatus }) =>
	status === 'GRANTED' ? (
		<CheckOutlinedIcon
			sx={{
				color: 'success.main',
			}}
		/>
	) : (
		<CloseOutlinedIcon
			sx={{
				color: 'error.main',
			}}
		/>
	)
);

// Definir el estado y acciones del menú
interface MenuState {
	anchorEl: HTMLElement | null;
	selectedUser: User | null;
	isModalOpen: boolean;
}

type MenuAction =
	| { type: 'OPEN'; payload: { anchorEl: HTMLElement; user: User } }
	| { type: 'CLOSE' }
	| { type: 'SET_MODAL_OPEN'; payload: boolean };

const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
	switch (action.type) {
		case 'OPEN':
			return {
				anchorEl: action.payload.anchorEl,
				selectedUser: action.payload.user,
				isModalOpen: false,
			};
		case 'CLOSE':
			return {
				...state,
				anchorEl: null,
				isModalOpen: false,
			};
		case 'SET_MODAL_OPEN':
			return {
				...state,
				isModalOpen: action.payload,
			};
		default:
			return state;
	}
};

// Componente de fila optimizado
const UserTableRow = memo(
	({ row, onMenuOpen }: { row: Row<User>; onMenuOpen: (e: React.MouseEvent<HTMLElement>, user: User) => void }) => {
		return (
			<MuiTableRow>
				{row.getVisibleCells().map((cell) => (
					<TableCell
						key={cell.id}
						sx={
							cell.column.id === 'actions' || cell.column.id === 'status'
								? {
										px: '1px',
										width: '0rem',
										'&::before': {
											content: '""',
											position: 'absolute',
											left: '-1px',
											top: 0,
											bottom: 0,
											width: '1px',
											backgroundColor: '#E0E0E0',
											zIndex: 1,
										},
								  }
								: undefined
						}
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				))}
			</MuiTableRow>
		);
	}
);

const UserStatusIcon = memo(({ user }: { user: User }) => {
	const theme = useTheme();
	const daysUntilExpiration = user.enrollment?.endDate
		? dayjs(user.enrollment.endDate).startOf('day').diff(dayjs().startOf('day'), 'day')
		: null;

	const isUserBirthday = user.birthDate ? dayjs().format('MM-DD') === dayjs(user.birthDate).format('MM-DD') : false;

	// Función auxiliar para renderizar el icono según si es cumpleaños o no
	const renderIcon = (Icon: typeof CheckCircleOutlinedIcon, color: string, size: string = '1.5rem') => {
		if (isUserBirthday) {
			return (
				<CakeOutlinedIcon
					sx={{
						fontSize: size,
						color: color,
					}}
				/>
			);
		}
		return (
			<Icon
				sx={{
					fontSize: size,
					color: color,
				}}
			/>
		);
	};

	if (!user.active) {
		return (
			<Tooltip title='Usuario desactivado' placement='right' arrow>
				{renderIcon(BlockOutlinedIcon, theme.palette.grey[500])}
			</Tooltip>
		);
	}

	if (!user.enrollment?.startDate || !user.enrollment?.endDate || !user.enrollment?.modality) {
		return (
			<Tooltip title='Sin inscripción activa' placement='right' arrow>
				{renderIcon(ErrorOutlineOutlinedIcon, theme.palette.info.main)}
			</Tooltip>
		);
	}

	if (daysUntilExpiration !== null && daysUntilExpiration < 0) {
		return (
			<Tooltip title='Inscripción vencida' placement='right' arrow>
				{renderIcon(CancelOutlinedIcon, theme.palette.error.main)}
			</Tooltip>
		);
	}

	if (daysUntilExpiration !== null && daysUntilExpiration <= 7) {
		return (
			<Tooltip
				title={
					daysUntilExpiration === 0
						? 'Inscripción vence hoy'
						: `Inscripción vence en ${daysUntilExpiration} día${daysUntilExpiration === 1 ? '' : 's'}`
				}
				placement='right'
				arrow
			>
				{renderIcon(AccessTimeOutlinedIcon, theme.palette.warning.main)}
			</Tooltip>
		);
	}

	return (
		<Tooltip title={`Inscripción vence en ${daysUntilExpiration} días`} placement='right' arrow>
			{renderIcon(CheckCircleOutlinedIcon, theme.palette.success.main)}
		</Tooltip>
	);
});

interface TableFilters {
	page: number;
	limit: number;
	search?: string;
	modality?: Modality;
	status?: UserStatus;
	sortBy?: SortableFields;
	sortOrder?: 'asc' | 'desc';
}

interface LocalFilters {
	search: string;
	modality: Modality | 'ALL';
	status: UserStatus;
	sortBy: SortField;
	sortOrder: 'asc' | 'desc';
}

const UsersTable = memo(({ onEdit, onDelete, onAddPayment }: UsersTableProps) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	// const getValidatedParams = useCallback(
	// 	(totalPages?: number) => {
	// 		const page = Number(searchParams.get('page')) || 1;
	// 		const limit = Number(searchParams.get('limit')) || 20;

	// 		const validLimit = [20, 50, 100].includes(limit) ? limit : 20;
	// 		let validPage = Math.max(1, page);

	// 		// Si tenemos totalPages, aseguramos que la página no exceda el máximo
	// 		if (totalPages) {
	// 			validPage = Math.min(validPage, totalPages);
	// 		}

	// 		return {
	// 			page: validPage,
	// 			limit: validLimit,
	// 		};
	// 	},
	// 	[searchParams]
	// );

	const [localFilters, setLocalFilters] = useState<LocalFilters>({
		search: '',
		modality: 'ALL',
		status: 'ALL',
		sortBy: null,
		sortOrder: 'asc',
	});

	const [filters, setFilters] = useState<TableFilters>(() => ({
    // ...getValidatedParams(),
    page: 1,
    limit: 20,
		search: undefined,
		modality: undefined,
		status: undefined,
		sortBy: undefined,
		sortOrder: undefined,
	}));

	const handleFilterChange = useCallback(
		(newFilters: Partial<TableFilters>) => {
			// const params = new URLSearchParams();
			// params.set('page', String(newFilters.page || 1));
			// params.set('limit', String(newFilters.limit || 20));
			// setSearchParams(params, { replace: true });
			setFilters((prev) => ({
				...prev,
				...newFilters,
				page: newFilters.page || 1,
				limit: newFilters.limit || 20,
			}));
		},
		[setSearchParams]
	);

	// Manejadores de filtros locales
	const handleModalityChange = useCallback((newModality: Modality | 'ALL') => {
		setLocalFilters((prev) => ({ ...prev, modality: newModality }));
		setFilters((prev) => ({
			...prev,
			modality: newModality === 'ALL' ? undefined : newModality,
			page: 1,
		}));
	}, []);

	const handleStatusChange = useCallback((newStatus: UserStatus) => {
		setLocalFilters((prev) => ({ ...prev, status: newStatus }));
		setFilters((prev) => ({
			...prev,
			status: newStatus === 'ALL' ? undefined : newStatus,
			page: 1,
		}));
	}, []);

	const handleSearchChange = useCallback((newSearch: string) => {
		setLocalFilters((prev) => ({ ...prev, search: newSearch }));
		setFilters((prev) => ({
			...prev,
			search: newSearch || undefined,
			page: 1,
		}));
	}, []);

	const handleSortChange = useCallback(({ field, order }: { field: SortField; order: 'asc' | 'desc' }) => {
		setLocalFilters((prev) => ({ ...prev, sortBy: field, sortOrder: order }));
		setFilters((prev) => ({
			...prev,
			sortBy: field || undefined,
			sortOrder: field ? order : undefined,
			page: 1,
		}));
	}, []);

	// Sincronizar con URL solo para page y limit
	// useEffect(() => {
	// 	const urlParams = getValidatedParams();
	// 	if (urlParams.page !== filters.page || urlParams.limit !== filters.limit) {
	// 		setFilters((prev) => ({
	// 			...prev,
	// 			...urlParams,
	// 		}));
	// 	}
	// }, [searchParams, getValidatedParams]);

	const { data, isLoading, error } = useGetUsersQuery(filters);
	const users = useMemo(() => data?.items || [], [data]);

	// Efecto para manejar cambios en la respuesta
	useEffect(() => {
		if (data) {
			// const validatedParams = getValidatedParams(data.meta.totalPages);

			// if (
			// 	validatedParams.page !== filters.page ||
			// 	validatedParams.limit !== filters.limit ||
			// 	(filters.page > data.meta.totalPages && data.meta.totalPages > 0)
			// ) {
				setFilters((prev) => ({
					...prev,
					// ...validatedParams,
					// page: Math.min(validatedParams.page, data.meta.totalPages || 1),
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

	const [menuState, dispatch] = useReducer(menuReducer, {
		anchorEl: null,
		selectedUser: null,
		isModalOpen: false,
	});

	const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, user: User) => {
		event.stopPropagation();
		dispatch({ type: 'OPEN', payload: { anchorEl: event.currentTarget, user } });
	}, []);

	const handleMenuClose = useCallback(() => {
		if (!menuState.isModalOpen) {
			dispatch({ type: 'CLOSE' });
		}
	}, [menuState.isModalOpen]);

	const handleNavigate = useCallback(
		(id: string) => {
			navigate(`/users/${id}`);
		},
		[navigate]
	);

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: 'status',
				header: '',
				cell: (info) => (
					<Box
						sx={{
							display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
						}}
					>
						<UserStatusIcon user={info.row.original} />
					</Box>
				),
			}),
			columnHelper.accessor((row) => `${row.name} ${row.lastName}`, {
				id: 'fullName',
				header: 'Nombre y Apellido',
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor('dni', {
				header: 'DNI',
			}),
			columnHelper.accessor('phone', {
				header: 'Teléfono',
				cell: (info) => {
					const phone = info.getValue();
					const formattedPhone = phone?.replace(/\D/g, ''); // Elimina caracteres no numéricos
					return (
						<Tooltip title='Abrir WhatsApp' placement='right' arrow>
							<Box component='a' href={`https://wa.me/${formattedPhone}`} target='_blank' rel='noopener noreferrer'>
								{phone}
							</Box>
						</Tooltip>
					);
				},
			}),
			// columnHelper.accessor('email', {
			// 	header: 'Email',
			// 	cell: (info) => info.getValue() || '-',
			// }),
			// columnHelper.accessor('birthDate', {
			// 	header: 'F. Nacimiento',
			// 	cell: (info) => (info.getValue() ? dayjs(info.getValue()).format('DD/MM/YYYY') : '-'),
			// }),

			columnHelper.accessor('enrollment.modality', {
				id: 'modality',
				header: 'Modalidad',
				cell: (info) => {
					const enrollment = info.row.original.enrollment;
					if (!enrollment?.modality) return '-';

					const modalityMap: Record<Modality, string> = {
						FREE: 'Libre',
						THREE: '3 Días',
						TWO: '2 Días',
					};
					return modalityMap[enrollment.modality] || '-';
				},
			}),
			// columnHelper.accessor('enrollment.startDate', {
			// 	header: 'Inicio',
			// 	cell: (info) => {
			// 		const enrollment = info.row.original.enrollment;
			// 		return enrollment?.startDate ? formatDate(enrollment.startDate) : '-';
			// 	},
			// }),
			columnHelper.accessor('enrollment.endDate', {
				header: 'Vencimiento',
				cell: (info) => {
					const enrollment = info.row.original.enrollment;
					return enrollment?.endDate ? formatDate(enrollment.endDate) : '-';
				},
			}),
			columnHelper.accessor('enrollment.accesses', {
				id: 'lastAccess',
				header: 'Último Acceso',
				cell: (info) => {
					const enrollment = info.row.original.enrollment;
					const accesses = enrollment?.accesses;
					if (!accesses || accesses.length === 0) return '-';

					const lastAccess = accesses[accesses.length - 1];
					return (
						<Tooltip
							title={lastAccess.status === 'DENIED' && lastAccess.deniedReason ? lastAccess.deniedReason : ''}
							placement='right'
							arrow
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
								}}
							>
								<AccessStatusIcon status={lastAccess.status} />
								{formatDateTime(lastAccess.accessDate)}
							</Box>
						</Tooltip>
					);
				},
			}),
			columnHelper.display({
				id: 'actions',
				header: '',
				cell: (info) => (
					<IconButton size='small' onClick={(e) => handleMenuOpen(e, info.row.original)}>
						<MoreVertIcon fontSize='small' />
					</IconButton>
				),
			}),
		],
		[handleMenuOpen]
	);

	const table = useReactTable({
		data: users,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (error) {
		return (
			<Typography color='error' textAlign='center'>
				Error al cargar los clientes
			</Typography>
		);
	}

	if (!data || !Array.isArray(data.items)) {
		return (
			<Typography color='error' textAlign='center'>
				No se pudieron obtener los datos de clientes. Intenta recargar o re-loguear.
			</Typography>
		);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1 }}>
			<UserTableFilters
				filters={filters}
				modality={localFilters.modality}
				status={localFilters.status}
				search={localFilters.search}
				sortBy={localFilters.sortBy}
				sortOrder={localFilters.sortOrder}
				onModalityChange={handleModalityChange}
				onStatusChange={handleStatusChange}
				onSearchChange={handleSearchChange}
				onSortChange={handleSortChange}
			/>

			<TableContainer
				component={Paper}
				elevation={0}
				variant='outlined'
				sx={{
					'& th:last-child': {
						position: 'sticky',
						right: 0,
						// zIndex: 2,
						backgroundColor: 'inherit',
					},
					'& td:last-child': {
						position: 'sticky',
						right: 0,
						backgroundColor: 'inherit',
					},
				}}
			>
				<Table size='small'>
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<MuiTableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableCell
										key={header.id}
										sx={
											header.id === 'actions'
												? {
														'&::before': {
															content: '""',
															position: 'absolute',
															left: '-1px',
															top: 0,
															bottom: 0,
															width: '1px',
															// backgroundColor: 'red',
															backgroundColor: '#E0E0E0',
															zIndex: 1,
														},
												  }
												: undefined
										}
									>
										{flexRender(header.column.columnDef.header, header.getContext())}
									</TableCell>
								))}
							</MuiTableRow>
						))}
					</TableHead>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<UserTableRow key={row.id} row={row} onMenuOpen={handleMenuOpen} />
						))}
					</TableBody>
				</Table>
				{users.length === 0 && (
					<Box p={2} textAlign='center'>
						<Typography color='textSecondary'>No hay clientes registrados</Typography>
					</Box>
				)}
			</TableContainer>

			{data && data.items.length > 0 && (
				<TablePagination
					page={filters.page}
					limit={filters.limit}
					totalPages={data.meta.totalPages}
					onPageChange={(newPage) => handleFilterChange({ ...filters, page: newPage })}
					onLimitChange={(newLimit) => handleFilterChange({ ...filters, limit: newLimit, page: 1 })}
				/>
			)}

			<UserActionsMenu
				open={Boolean(menuState.anchorEl)}
				anchorEl={menuState.anchorEl}
				user={menuState.selectedUser}
				onClose={handleMenuClose}
				onNavigate={handleNavigate}
				onEdit={onEdit}
				onDelete={onDelete}
				onAddPayment={onAddPayment}
			/>
		</Box>
	);
});

export default UsersTable;
