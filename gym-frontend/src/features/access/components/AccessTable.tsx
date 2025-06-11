import { useMemo, memo, useCallback } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Typography,
	Tooltip,
	Chip,
	Stack,
} from '@mui/material';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
} from '@tanstack/react-table';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Access } from '../types/access.types';
import { AccessStatus, Modality } from '../../users/types/enums';
import { formatDateTime } from '../../../utils/dateUtils';
import LoadingScreen from '../../../components/common/LoadingScreen';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Access>();

interface AccessTableProps {
	accesses: Access[];
	isLoading: boolean;
	error?: any;
}

const AccessStatusChip = memo(
	({
		status,
		deniedReason,
		modality,
		remainingAccesses,
		isBirthday,
	}: {
		status: AccessStatus;
		deniedReason: string | null;
		modality: Modality | null;
		remainingAccesses?: number;
		isBirthday?: boolean;
	}) => (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
			<Tooltip
				title={status === AccessStatus.GRANTED ? 'Permitido' : deniedReason || 'Denegado'}
				placement='right'
				arrow
			>
				<Box sx={{ display: 'flex', alignItems: 'center', p: '3px' }}>
					{status === AccessStatus.GRANTED ? (
						<CheckOutlinedIcon
							sx={{
								color: 'success.main',
								fontSize: '1.5rem',
							}}
						/>
					) : (
						<CloseOutlinedIcon
							sx={{
								color: 'error.main',
								fontSize: '1.5rem',
							}}
						/>
					)}
				</Box>
			</Tooltip>
			{isBirthday && (
				<Tooltip title='¡Cumpleaños!' placement='right' arrow>
					<CakeOutlinedIcon
						sx={{
							color: 'secondary.main',
							fontSize: '1.85rem',
						}}
					/>
				</Tooltip>
			)}
			{modality && modality !== Modality.FREE && remainingAccesses !== undefined && (
				<Tooltip title={`${remainingAccesses} accesos restantes esta semana`} placement='right' arrow>
					<Typography
						variant='caption'
						sx={{
							color: remainingAccesses > 0 ? 'info.main' : 'warning.main',
							fontWeight: 'medium',
							fontSize: '0.75rem',
						}}
					>
						{remainingAccesses}
					</Typography>
				</Tooltip>
			)}
		</Box>
	)
);

const AccessTable = memo(({ accesses, isLoading, error }: AccessTableProps) => {
	const navigate = useNavigate();

	const handleNavigateToUser = useCallback((userId: string) => {
		navigate(`/users/${userId}`);
	}, [navigate]);

	const columns = useMemo(
		() => [
			columnHelper.accessor('status', {
				header: '',
				cell: (info) => {
					const access = info.row.original;
					const isBirthday = access.enrollment.user.birthDate
						? dayjs().format('MM-DD') === dayjs(access.enrollment.user.birthDate).format('MM-DD')
						: false;

					return (
						<AccessStatusChip
							status={info.getValue()}
							deniedReason={access.deniedReason}
							modality={access.enrollment.modality}
							remainingAccesses={access.enrollment.remainingAccesses}
							isBirthday={isBirthday}
						/>
					);
				},
			}),
			columnHelper.accessor('accessDate', {
				header: 'Fecha y Hora',
				cell: (info) => formatDateTime(info.getValue()),
			}),
			columnHelper.accessor('enrollment.user.name', {
				header: 'Nombre y Apellido',
				cell: (info) => (
					<Tooltip title="Ver detalles" placement="right" arrow>
						<Box
							component="span"
							sx={{
								cursor: 'pointer',
								'&:hover': {
									color: 'primary.main',
								},
							}}
							onClick={() => handleNavigateToUser(info.row.original.enrollment.user.id)}
						>
							{`${info.getValue()} ${info.row.original.enrollment.user.lastName}`}
						</Box>
					</Tooltip>
				),
			}),
			columnHelper.accessor('enrollment.user.dni', {
				header: 'DNI',
			}),
			columnHelper.accessor('enrollment.user.phone', {
				header: 'Teléfono',
				cell: (info) => {
					const phone = info.getValue();
					if (!phone) return '-';
					
					const formattedPhone = phone.replace(/\D/g, ''); // Elimina caracteres no numéricos
					return (
						<Tooltip title='Abrir WhatsApp' placement='right' arrow>
							<Box 
								component='a' 
								href={`https://wa.me/${formattedPhone}`} 
								target='_blank' 
								rel='noopener noreferrer'
								sx={{
									textDecoration: 'none',
									color: 'inherit',
									'&:hover': {
										color: 'primary.main',
									},
								}}
							>
								{phone}
							</Box>
						</Tooltip>
					);
				},
			}),
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
		],
		[handleNavigateToUser]
	);

	const table = useReactTable({
		data: accesses,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	if (isLoading) return <LoadingScreen />;

	if (error) {
		return (
			<Typography color='error' textAlign='center'>
				Error al cargar los accesos
			</Typography>
		);
	}

	return (
    <TableContainer component={Paper} elevation={0} variant='outlined'>
			<Table size='small'>
				<TableHead>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableCell
									key={header.id}
									sx={
										header.id === 'status'
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
									{flexRender(header.column.columnDef.header, header.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableHead>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									sx={
										cell.column.id === 'status'
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
						</TableRow>
					))}
				</TableBody>
			</Table>
			{accesses.length === 0 && (
				<Box p={2} textAlign='center'>
					<Typography color='textSecondary'>No hay registros de acceso</Typography>
				</Box>
			)}
		</TableContainer>
	);
});

export default AccessTable;
