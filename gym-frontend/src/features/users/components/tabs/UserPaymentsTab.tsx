import { memo, useState, useCallback } from 'react';
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
} from '@mui/material';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { PaymentHistory } from '../../types/users.types';
import { formatDate, formatCurrency } from '../../../../utils/dateUtils';
import { useGetUserPaymentHistoryQuery } from '../../api/usersApi';
import LoadingScreen from '../../../../components/common/LoadingScreen';
import TablePagination from '../../../../components/table/TablePagination';
import { Modality } from '../../types/enums';

interface UserPaymentsTabProps {
  userId: string;
}

const columnHelper = createColumnHelper<PaymentHistory>();

const modalityMap: Record<Modality, string> = {
  FREE: 'Libre',
  THREE: '3 Días',
  TWO: '2 Días',
};

const UserPaymentsTab = memo(({ userId }: UserPaymentsTabProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error } = useGetUserPaymentHistoryQuery({
    userId,
    page,
    limit,
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const columns = [
		columnHelper.accessor('createdAt', {
			header: 'Fecha',
			cell: (info) => (
				<Box sx={{ pt: '10px' }}>
					{formatDate(info.getValue().toString())}
				</Box>
			),
		}),
		columnHelper.accessor('amount', {
			header: 'Monto',
			cell: (info) => formatCurrency(info.getValue(), info.row.original.currency),
		}),
			columnHelper.accessor('modality', {
			header: 'Modalidad',
			cell: (info) => modalityMap[info.getValue()],
		}),
			columnHelper.accessor('startDate', {
			header: 'Inicio',
			cell: (info) => {
				const date = info.getValue();
				return date ? formatDate(date.toString()) : '-';
			},
		}),
			columnHelper.accessor('endDate', {
			header: 'Vencimiento',
			cell: (info) => {
				const date = info.getValue();
				return date ? formatDate(date.toString()) : '-';
			},
		}),

			columnHelper.accessor('discount', {
			header: 'Descuento',
			cell: (info) => {
				const discount = info.getValue();
				return discount ? formatCurrency(discount, info.row.original.currency) : '-';
			},
		}),
		columnHelper.accessor('comments', {
			header: 'Comentarios',
			cell: (info) => info.getValue() || '-',
		}),
	];

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        Error al cargar el historial de pagos
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', flexGrow: 1 }}>
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {(!data?.items || data.items.length === 0) && (
          <Box p={2} textAlign="center">
            <Typography color="textSecondary">No hay registros de pagos</Typography>
          </Box>
        )}
      </TableContainer>

      {data && data.items.length > 0 && (
        <TablePagination
          page={page}
          limit={limit}
          totalPages={data.meta.totalPages}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </Box>
  );
});

export default UserPaymentsTab; 