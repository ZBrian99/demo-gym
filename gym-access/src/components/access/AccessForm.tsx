import { Box, TextField, Typography, Paper } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { ChangeEvent, FormEvent, useEffect } from 'react';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';

interface AccessFormProps {
  dni: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: FormEvent) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

// Estilos constantes para evitar recreaciones
const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'background.paper',
    '& input': {
      fontSize: {
        xs: '1.4rem',
        sm: '2rem',
        md: '2.6rem',
        lg: '3.2rem'
      },
      letterSpacing: {
        xs: '0.1rem',
        sm: '0.2rem',
        md: '0.25rem',
        lg: '0.3rem'
      },
      textAlign: 'center',
      px: {
        xs: '2.5rem',
        sm: '3rem',
        md: '4rem',
        lg: '5rem'
      },
    },
    '& fieldset': {
      borderColor: 'primary.main',
      borderWidth: {
        xs: '0.1rem',
        sm: '0.15rem',
        md: '0.18rem',
        lg: '0.2rem'
      },
    },
    '&:hover fieldset': {
      borderColor: 'primary.main',
    },
  },
};

const StyledIcon = styled('div')(({ theme }) => ({
  fontSize: '4rem',
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& > svg': {
    fontSize: 'inherit',
  },
  [theme.breakpoints.down('lg')]: {
    fontSize: '3.5rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.6rem',
  }
}));

export const AccessForm = ({ dni, inputRef, onSubmit, onChange, onReset }: AccessFormProps) => {
  // Reset automático
  useEffect(() => {
    if (!dni) return;
    const timer = setTimeout(onReset, 10000);
    return () => clearTimeout(timer);
  }, [dni, onReset]);

  return (
    <Paper
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
          lg: 6
        },
        borderRadius: {
          xs: 2,
          sm: 3,
          md: 4,
          lg: 6
        },
        bgcolor: 'background.default',
        position: 'relative',
        boxShadow: {
          xs: '0 0 0.5rem 0.1rem rgba(0, 0, 0, 0.15)',
          sm: '0 0 1rem 0.25rem rgba(0, 0, 0, 0.15)',
          md: '0 0 1.5rem 0.35rem rgba(0, 0, 0, 0.15)',
          lg: '0 0 2rem 0.5rem rgba(0, 0, 0, 0.15)'
        },
      }}
    >
      <form onSubmit={onSubmit} style={{ width: '100%' }}>
        <Box
          sx={{
            textAlign: 'center',
            mb: {
              xs: 1.5,
              sm: 2,
              md: 2.25,
              lg: 2.5
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: {
                xs: 2,
                sm: 3,
                md: 4,
                lg: 5
              },
              mb: {
                xs: 1.5,
                sm: 2,
                md: 2.25,
                lg: 2.5
              },
            }}
          >
            <StyledIcon><DirectionsRunIcon /></StyledIcon>
            <StyledIcon><FitnessCenterIcon /></StyledIcon>
            <StyledIcon><SportsGymnasticsIcon /></StyledIcon>
          </Box>

          <Typography
            variant='h1'
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '2.6rem',
                md: '3rem',
                lg: '3.6rem'
              },
              fontWeight: 'bold',
              background: (theme) => 
                `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: {
                xs: 0.75,
                sm: 1,
                md: 1.25,
                lg: 1.5
              },
            }}
          >
            Control de Acceso
          </Typography>
          <Typography
            variant='h2'
            sx={{
              fontSize: {
                xs: '1.6rem',
                sm: '2rem',
                md: '2.3rem',
                lg: '2.6rem'
              },
              color: 'text.primary',
              mb: {
                xs: 1.5,
                sm: 2,
                md: 2.5,
                lg: 3
              },
              fontWeight: 500,
            }}
          >
            Ingrese su DNI y presione Enter
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <KeyboardIcon
            sx={{
              color: 'primary.main',
              fontSize: {
                xs: '2rem',
                sm: '3.2rem'
              },
              position: 'absolute',
              left: {
                xs: '1rem',
                sm: '1.8rem'
              },
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          />
          <TextField
            fullWidth
            inputRef={inputRef}
            value={dni}
            onChange={onChange}
            onBlur={() => inputRef.current?.focus()}
            placeholder='DNI'
            variant='outlined'
            autoComplete='off'
            autoFocus
            spellCheck={false}
            autoCorrect='off'
            sx={textFieldStyles}
          />
        </Box>
      </form>
    </Paper>
  );
}; 