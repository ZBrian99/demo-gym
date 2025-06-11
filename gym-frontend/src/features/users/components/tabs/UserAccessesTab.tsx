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
import { AccessHistory } from '../../types/users.types';
import { formatDateTime } from '../../../../utils/dateUtils';
import { useGetUserAccessHistoryQuery } from '../../api/usersApi';
import LoadingScreen from '../../../../components/common/LoadingScreen';
import TablePagination from '../../../../components/table/TablePagination';
import { AccessStatus, Modality } from '../../types/enums';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface UserAccessesTabProps {
  userId: string;
}

const columnHelper = createColumnHelper<AccessHistory>();

const modalityMap: Record<Modality, string> = {
  FREE: 'Libre',
  THREE: '3 Días',
  TWO: '2 Días',
};

const AccessStatusIcon = memo(({ status }: { status: AccessStatus }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: '3px' }}>
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
));

const UserAccessesTab = memo(({ userId }: UserAccessesTabProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data, isLoading, error } = useGetUserAccessHistoryQuery({
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
    columnHelper.accessor('status', {
      header: '',
      cell: (info) => (
        <AccessStatusIcon status={info.getValue()} />
      ),
    }),
    columnHelper.accessor('accessDate', {
      header: 'Fecha y Hora',
      cell: (info) => formatDateTime(info.getValue()),
    }),
    columnHelper.accessor('enrollment.modality', {
      header: 'Modalidad',
      cell: (info) => info.getValue() ? modalityMap[info.getValue()] : '-',
    }),
    columnHelper.accessor('status', {
      id: 'statusMessage',
      header: 'Estado',
      cell: (info) => {
        const status = info.getValue();
        const deniedReason = info.row.original.deniedReason;
        return (
          <Typography variant="body2">
            {status === AccessStatus.GRANTED ? 'Permitido' : deniedReason || 'Denegado'}
          </Typography>
        );
      },
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
        Error al cargar el historial de accesos
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="small">
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
        {(!data?.items || data.items.length === 0) && (
          <Box p={2} textAlign="center">
            <Typography color="textSecondary">No hay registros de accesos</Typography>
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

export default UserAccessesTab; 