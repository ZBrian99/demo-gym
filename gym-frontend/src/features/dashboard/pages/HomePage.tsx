import { Box, Typography, Paper, useTheme, Alert, Stack } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';

const ColorBox = ({ color, name, textColor = '#fff' }: { color: string; name: string; textColor?: string }) => {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        bgcolor: color,
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: `1px solid ${
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.12)'
        }`,
        boxShadow: theme.palette.mode === 'dark'
          ? '0px 4px 12px rgba(0, 0, 0, 0.5)'
          : '0px 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: textColor,
          textShadow: theme.palette.mode === 'dark'
            ? '0px 1px 2px rgba(0, 0, 0, 0.5)'
            : 'none',
        }}
      >
        {name}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          color: textColor,
          textShadow: theme.palette.mode === 'dark'
            ? '0px 1px 2px rgba(0, 0, 0, 0.5)'
            : 'none',
        }}
      >
        {color}
      </Typography>
    </Paper>
  );
};

const StatusIconBox = ({ icon: Icon, color, name, description }: { 
  icon: typeof CheckCircleOutlinedIcon, 
  color: string, 
  name: string,
  description: string
}) => {
  const theme = useTheme();
  
  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: `1px solid ${
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.12)'
        }`,
      }}
    >
      <Icon sx={{ color, fontSize: '2rem' }} />
      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Estados de Usuario */}
      <Typography variant="h4" sx={{ mb: 4 }}>
        Estados y Notificaciones
      </Typography>

      <Stack spacing={3}>
        {/* Estados de Usuario */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Estados de Usuario</Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)'
            },
            gap: 2
          }}>
            <StatusIconBox 
              icon={CheckCircleOutlinedIcon}
              color={theme.palette.success.main}
              name="Activo"
              description="Usuario con inscripción vigente"
            />
            <StatusIconBox 
              icon={AccessTimeOutlinedIcon}
              color={theme.palette.warning.main}
              name="Por Vencer"
              description="Inscripción vence en menos de 7 días"
            />
            <StatusIconBox 
              icon={CancelOutlinedIcon}
              color={theme.palette.error.main}
              name="Vencido"
              description="Inscripción vencida"
            />
            <StatusIconBox 
              icon={ErrorOutlineOutlinedIcon}
              color={theme.palette.info.main}
              name="Sin Inscripción"
              description="Usuario sin inscripción activa"
            />
            <StatusIconBox 
              icon={BlockOutlinedIcon}
              color={theme.palette.grey[500]}
              name="Desactivado"
              description="Usuario desactivado del sistema"
            />
            <StatusIconBox 
              icon={CakeOutlinedIcon}
              color={theme.palette.secondary.main}
              name="Cumpleaños"
              description="Usuario está de cumpleaños hoy"
            />
          </Box>
        </Box>

        {/* Alerts/Snackbars */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notificaciones del Sistema
          </Typography>
          <Stack spacing={2} sx={{ maxWidth: '30rem' }}>
            <Alert severity="success">Este es un mensaje de éxito</Alert>
            <Alert severity="error">Este es un mensaje de error</Alert>
            <Alert severity="warning">Este es un mensaje de advertencia</Alert>
            <Alert severity="info">Este es un mensaje informativo</Alert>
          </Stack>
        </Box>

        {/* Paleta de Colores (Versión Compacta) */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Paleta de Colores</Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)'
            },
            gap: 1
          }}>
            <ColorBox color={theme.palette.primary.main} name="Primary" />
            <ColorBox color={theme.palette.secondary.main} name="Secondary" />
            <ColorBox color={theme.palette.success.main} name="Success" />
            <ColorBox color={theme.palette.error.main} name="Error" />
            <ColorBox color={theme.palette.warning.main} name="Warning" />
            <ColorBox color={theme.palette.info.main} name="Info" />
          </Box>
        </Box>

        {/* Tipografía */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Tipografía</Typography>
          <Stack spacing={1} sx={{ maxWidth: '40rem' }}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
            <Typography variant="subtitle1">Subtitle 1</Typography>
            <Typography variant="subtitle2">Subtitle 2</Typography>
            <Typography variant="body1">Body 1: Lorem ipsum dolor sit amet</Typography>
            <Typography variant="body2">Body 2: Lorem ipsum dolor sit amet</Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default HomePage; 