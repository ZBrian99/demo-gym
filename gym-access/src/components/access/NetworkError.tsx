import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useEffect } from 'react';

interface NetworkErrorProps {
  error: string;
  onClose: () => void;
}

export const NetworkError = ({ error, onClose }: NetworkErrorProps) => {
  const theme = useTheme();

  useEffect(() => {
    const cleanup = () => {
      window.removeEventListener('keydown', onClose);
      clearTimeout(timer);
    };
    
    const timer = setTimeout(onClose, 10000);
    window.addEventListener('keydown', onClose);
    
    return cleanup;
  }, [onClose]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        padding: 2,
      }}
      onClick={onClose}
    >
      <Paper
        elevation={2}
        onClick={(e) => e.stopPropagation()}
        sx={{
          p: {
            xs: 2.5,
            sm: 3.5
          },
          width: {
            xs: '100%',
            sm: '55rem'
          },
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: {
            xs: 3,
            sm: 6
          },
          borderTop: (theme) => `6px solid ${theme.palette.error.main}`,
          bgcolor: 'background.paper',
          minHeight: {
            xs: '20rem',
            sm: '26rem'
          }
        }}
      >
        <WifiOffIcon
          sx={{
            fontSize: {
              xs: '2.4rem',
              sm: '3.4rem'
            },
            mb: {
              xs: 1.5,
              sm: 2
            },
            mt: 0.5,
            alignSelf: 'center',
            color: 'error.main',
          }}
        />
        <Box sx={{ 
          textAlign: 'center', 
          flex: '1', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center' 
        }}>
          <Typography 
            variant='h3' 
            sx={{ 
              mb: {
                xs: 1,
                sm: 1.5
              },
              color: 'primary.main',
              fontWeight: 'bold',
              fontSize: {
                xs: '2.6rem',
                sm: '3.6rem'
              }
            }}
          >
            Error de Conexión
          </Typography>
          <Typography 
            sx={{ 
              fontSize: {
                xs: '2rem',
                sm: '2.8rem'
              },
              mb: {
                xs: 1,
                sm: 1.5
              },
              color: 'text.primary',
              maxWidth: '90%',
              mx: 'auto',
              lineHeight: 1.3,
              fontWeight: 'bold'
            }}
          >
            {error} 🔌
          </Typography>
          <Box
            sx={{
              mt: {
                xs: 2,
                sm: 2.5,
              },
              p: {
                xs: 2,
                sm: 2.5,
              },
              bgcolor: 'background.default',
              borderRadius: 2,
              border: '2px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: '1.6rem',
                  sm: '2rem'
                },
                color: 'text.primary',
                maxWidth: '90%',
                mx: 'auto',
                fontWeight: 500
              }}
            >
              Si el problema persiste, por favor, comunícate con el equipo
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            mt: 'auto',
            pt: {
              xs: 2,
              sm: 3
            },
            color: 'text.secondary',
          }}
        >
          <KeyboardReturnIcon sx={{ 
            fontSize: {
              xs: '1.2rem',
              sm: '1.6rem'
            }
          }} />
          <Typography sx={{ 
            fontSize: {
              xs: '1rem',
              sm: '1.4rem'
            }, 
            fontWeight: 500 
          }}>
            Presione cualquier tecla para continuar
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
