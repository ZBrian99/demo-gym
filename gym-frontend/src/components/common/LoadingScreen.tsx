import { Box, CircularProgress } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        height: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen; 