import { memo } from 'react';
import { Stack, Typography, Paper, Box, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { User } from '../../types/users.types';
import { formatDate } from '../../../../utils/dateUtils';

interface UserDetailsTabProps {
  user: User;
}

const UserDetailsTab = memo(({ user }: UserDetailsTabProps) => {
  const details = [
    { label: 'Nombre', value: user.name, icon: <PersonIcon color="primary" /> },
    { label: 'Apellido', value: user.lastName, icon: <PersonIcon color="primary" /> },
    { label: 'DNI', value: user.dni, icon: <BadgeIcon color="primary" /> },
    { 
      label: 'Teléfono', 
      value: user.phone, 
      icon: <PhoneIcon color="primary" />,
      isPhone: true
    },
    { label: 'Email', value: user.email || '-', icon: <EmailIcon color="primary" /> },
    { label: 'Fecha de Nacimiento', value: user.birthDate ? formatDate(user.birthDate) : '-', icon: <CakeIcon color="primary" /> },
    { 
      label: 'Estado', 
      value: user.active ? 'Activo' : 'Inactivo',
      icon: user.active ? <CheckCircleIcon color="success" /> : <CircleOutlinedIcon color="error" />,
      highlight: true
    },
    { label: 'Fecha de Registro', value: formatDate(user.createdAt), icon: <CalendarMonthIcon color="primary" /> },
  ];

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)'
          },
          gap: 3
        }}
      >
        {details.map(({ label, value, icon, highlight, isPhone }) => (
          <Stack 
            key={label} 
            direction="row" 
            spacing={2} 
            alignItems="center"
            sx={{
              p: 1.5,
              bgcolor: 'background.default',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'border-color 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
              }
            }}
          >
            {icon}
            <Stack>
              <Typography variant="subtitle2" color="text.secondary">
                {label}
              </Typography>
              {isPhone ? (
                <Tooltip title='Abrir WhatsApp' placement='right' arrow>
                  <Box 
                    component='a' 
                    href={`https://wa.me/${value?.replace(/\D/g, '')}`} 
                    target='_blank' 
                    rel='noopener noreferrer'
                  >
                    {value}
                  </Box>
                </Tooltip>
              ) : (
                <Typography 
                  sx={{ 
                    fontWeight: highlight ? 600 : 400,
                    color: highlight ? (user.active ? 'success.main' : 'error.main') : 'text.primary'
                  }}
                >
                  {value}
                </Typography>
              )}
            </Stack>
          </Stack>
        ))}
      </Box>
    </Paper>
  );
});

export default UserDetailsTab; 