import { memo } from 'react';
import { Stack, Select, MenuItem, Typography, IconButton, FormControl, InputLabel } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SelectChangeEvent } from '@mui/material/Select';

interface TablePaginationProps {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const TablePagination = memo(({ 
  page, 
  limit, 
  totalPages, 
  onPageChange, 
  onLimitChange 
}: TablePaginationProps) => {
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    if (newLimit > 0) {
      onLimitChange(newLimit);
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      mt='auto'
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="items-per-page-label">Items por página</InputLabel>
        <Select
          labelId="items-per-page-label"
          id="items-per-page-select"
          value={limit}
          label="Items por página"
          onChange={handleLimitChange}
        >
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton 
          size="small"
          onClick={() => handlePageChange(1)}
          disabled={page <= 1}
          aria-label="Primera página"
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mx: 2, minWidth: '4rem', textAlign: 'center' }}
        >
          {page} / {totalPages}
        </Typography>

        <IconButton 
          size="small"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
        >
          <NavigateNextIcon fontSize="small" />
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => handlePageChange(totalPages)}
          disabled={page >= totalPages}
          aria-label="Última página"
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
});


export default TablePagination; 