import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import LoginForm from '../components/LoginForm';
import { useLoginMutation } from '../api/authApi';
import { LoginCredentials } from '../types/auth.types';
import { setCredentials } from '../slices/authSlice';

const defaultCredentials = {
  email: 'admin@admin.com',
  password: 'admin123'
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  const handleDemoLogin = async () => {
    try {
      const response = await login(defaultCredentials).unwrap();
      dispatch(setCredentials(response));
      navigate('/users');
    } catch (err) {
      console.error('Error en demo login:', err);
    }
  };

  const handleSubmit = async (data: LoginCredentials) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response));
      navigate('/users');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    }
  };

  // Extraemos el mensaje de error de la respuesta de la mutation
  const errorMessage = loginError && 'data' in loginError 
    ? (loginError.data as any)?.message 
    : 'Error al iniciar sesión. Por favor, verifica tus credenciales.';

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        padding: '1rem',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '25rem',
          borderRadius: '0.5rem',
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Demo Gym - Login
        </Typography>
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleDemoLogin}
          disabled={isLoading}
          sx={{ mb: 3 }}
        >
          Iniciar como Admin Demo
        </Button>

        <Box sx={{ mb: 3 }}>
          <Divider>
            <Typography variant="body2" color="text.secondary">
              o inicia sesión manualmente
            </Typography>
          </Divider>
        </Box>

        <LoginForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          error={loginError ? errorMessage : undefined}
        />

        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ mt: 2 }}
        >
          Credenciales demo: {defaultCredentials.email} / {defaultCredentials.password}
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage; 