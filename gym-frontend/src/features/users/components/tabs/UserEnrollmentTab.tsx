import { memo, useMemo } from 'react';
import { Stack, Typography, Paper, Alert, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { User } from '../../types/users.types';
import { formatDate } from '../../../../utils/dateUtils';
import { Modality } from '../../types/enums';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

interface UserEnrollmentTabProps {
  user: User;
}

const modalityMap: Record<Modality, string> = {
  FREE: 'Libre',
  THREE: '3 Veces por semana',
  TWO: '2 Veces por semana',
};

const getEnrollmentStatus = (user: User, colors: {
  grey: string;
  info: string;
  error: string;
  warning: string;
  success: string;
}) => {
  if (!user.active) {
    return {
      label: 'Suspendida',
      color: colors.grey,
      icon: <BlockOutlinedIcon sx={{ color: colors.grey }} />
    };
  }

  if (!user.enrollment?.startDate || !user.enrollment?.endDate) {
    return {
      label: 'Sin inscripción',
      color: colors.info,
      icon: <ErrorOutlineOutlinedIcon sx={{ color: colors.info }} />
    };
  }

  const now = dayjs().startOf('day');
  const startDate = dayjs(user.enrollment.startDate).startOf('day');
  const endDate = dayjs(user.enrollment.endDate).startOf('day');
  const daysUntilEnd = endDate.diff(now, 'day');

  if (now.isBefore(startDate)) {
    return {
      label: 'Pendiente de inicio',
      color: colors.info,
      icon: <ErrorOutlineOutlinedIcon sx={{ color: colors.info }} />
    };
  }

  if (now.isAfter(endDate) || daysUntilEnd < 0) {
    return {
      label: 'Inscripción vencida',
      color: colors.error,
      icon: <CancelOutlinedIcon sx={{ color: colors.error }} />
    };
  }

  if (daysUntilEnd <= 7) {
    if (daysUntilEnd === 0) {
      return {
        label: 'Inscripción vence hoy',
        color: colors.warning,
        icon: <AccessTimeOutlinedIcon sx={{ color: colors.warning }} />
      };
    }
    return {
      label: `Inscripción vence en ${daysUntilEnd} día${daysUntilEnd === 1 ? '' : 's'}`,
      color: colors.warning,
      icon: <AccessTimeOutlinedIcon sx={{ color: colors.warning }} />
    };
  }

  if (user.enrollment.modality && ['TWO', 'THREE'].includes(user.enrollment.modality)) {
    const maxWeeklyAccesses = user.enrollment.modality === 'THREE' ? 3 : 2;

    if (user.enrollment.weeklyAccesses === maxWeeklyAccesses) {
      return {
        label: 'Sin accesos semanales',
        color: colors.warning,
        icon: <AccessTimeOutlinedIcon sx={{ color: colors.warning }} />
      };
    }
  }

  return {
    label: 'Activa',
    color: colors.success,
    icon: <CheckCircleOutlinedIcon sx={{ color: colors.success }} />
  };
};

const UserEnrollmentTab = memo(({ user }: UserEnrollmentTabProps) => {
  const theme = useTheme();

  const colors = {
    grey: theme.palette.grey[500],
    info: theme.palette.info.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main
  };

  if (!user.enrollment) {
    return (
      <Alert severity="info" icon={<InfoIcon />}>
        El usuario no tiene una inscripción activa
      </Alert>
    );
  }

  const enrollmentStatus = useMemo(() => getEnrollmentStatus(user, colors), [user, colors]);

  const details = [
    {
      label: 'Modalidad',
      value: user.enrollment.modality ? modalityMap[user.enrollment.modality] : '-',
      icon: <FitnessCenterIcon color="primary" />
    },
    {
      label: 'Estado',
      value: (
        <Typography sx={{ color: enrollmentStatus.color, fontWeight: 'medium' }}>
          {enrollmentStatus.label}
        </Typography>
      ),
      icon: enrollmentStatus.icon
    },
    {
      label: 'Fecha de Inicio',
      value: user.enrollment.startDate ? formatDate(user.enrollment.startDate) : '-',
      icon: <CalendarMonthIcon color="primary" />
    },
    {
      label: 'Fecha de Vencimiento',
      value: user.enrollment.endDate ? formatDate(user.enrollment.endDate) : '-',
      icon: <EventAvailableIcon color="primary" />
    },
    ...(user.enrollment.modality && ['TWO', 'THREE'].includes(user.enrollment.modality) ? [{
      label: 'Accesos Semanales',
      value: `${user.enrollment.weeklyAccesses} de ${user.enrollment.modality === 'THREE' ? '3' : '2'}`,
      icon: <AccessTimeIcon color="primary" />
    }] : [])
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
        {details.map(({ label, value, icon }) => (
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
              {typeof value === 'string' ? (
                <Typography>{value}</Typography>
              ) : (
                value
              )}
            </Stack>
          </Stack>
        ))}
      </Box>
    </Paper>
  );
});

export default UserEnrollmentTab; 