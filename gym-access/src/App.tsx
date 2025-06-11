import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { AccessResponse, AccessStatus } from './types/access.types'
import { Box, CircularProgress, Typography, Paper, Button } from '@mui/material'
import { AccessForm } from './components/access/AccessForm'
import { AccessResponse as AccessResponseComponent } from './components/access/AccessResponse'
import { NetworkError } from './components/access/NetworkError'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CakeIcon from '@mui/icons-material/Cake';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import BlockIcon from '@mui/icons-material/Block';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SecurityIcon from '@mui/icons-material/Security';

function App() {
  const [dni, setDni] = useState('')
  const [response, setResponse] = useState<AccessResponse | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedDni = dni.trim()
    if (!trimmedDni) return

    try {
      setIsLoading(true);
      setNetworkError(null);
      const { data } = await axios.post<AccessResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/access-control/register`,
        { dni: trimmedDni }
      );
      setResponse(data);
      setDni('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setNetworkError('No hay conexión con el servidor');
        } else if (error.response.status >= 500) {
          setNetworkError('El servidor no está respondiendo');
        } else {
          setNetworkError('Error de conexión');
        }
      } else {
        setNetworkError('Error inesperado');
      }
      setDni('');
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleClose = () => {
    setDni('')
    setResponse(null)
    setNetworkError(null)
  }

  const dniExamples = [
    { dni: '12345678', label: 'Activo', icon: CheckCircleOutlineIcon, color: 'success' },
    { dni: '23456789', label: 'Cumpleaños', icon: CakeIcon, color: 'secondary' },
    { dni: '34567890', label: '3 días/sem', icon: DirectionsRunIcon, color: 'info' },
    { dni: '67890123', label: 'Vence 5 días', icon: AccessTimeIcon, color: 'warning' },
    { dni: '78901234', label: 'Vence mañana', icon: WarningIcon, color: 'error' },
    { dni: '90123456', label: 'Sin accesos', icon: BlockIcon, color: 'error' },
    { dni: '45678901', label: 'Vencido', icon: ErrorOutlineIcon, color: 'error' },
    { dni: '56789012', label: 'Suspendido', icon: NoAccountsIcon, color: 'error' },
    { dni: '11223344', label: 'Admin', icon: SecurityIcon, color: 'primary' },
  ];

  return (
    <Box
      sx={{
        height: '100svh',
        display: 'flex',
        flexDirection: {
          xs: 'column',
          md: 'row'
        },
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          overflow: 'hidden',
          height: {
            xs: 'calc(100% - 16rem)',
            sm: 'calc(100% - 12rem)',
            md: '100%'
          },
        }}
      >
        {/* Background Wave */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: {xs: '-30%', md: '-10%'},
            right: {xs: '-30%', md: '-10%'},
            height: {xs: '30%', md: '40%'},
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 45%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: '0 0 50% 50%',
          }}
        />

        {/* Form Container */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '50rem',
            mx: 'auto',
            position: 'relative',
            zIndex: 1,
            px: {
              xs: 2,
              sm: 3,
              md: 4
            }
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '50rem',
              mx: 'auto'
            }}
          >
            <AccessForm
              dni={dni}
              inputRef={inputRef}
              onSubmit={handleSubmit}
              onChange={(e) => setDni(e.target.value)}
              onReset={handleClose}
            />
          </Box>
        </Box>
      </Box>

      {/* Sidebar */}
      <Paper
        elevation={2}
        sx={{
          width: {
            xs: '100%',
            md: '15rem'
          },
          height: {
            xs: 'auto',
            md: '100%'
          },
          maxHeight: {
            xs: '16rem',
            sm: '12rem',
            md: '100%'
          },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          zIndex: 2,
          borderRadius: 0,
          boxShadow: {
            xs: '0 -2px 8px rgba(0,0,0,0.1)',
            md: '-2px 0 8px rgba(0,0,0,0.1)'
          },
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {/* Botón de Admin */}
        <Button
          variant="contained"
          startIcon={<AdminPanelSettingsOutlinedIcon />}
          href="https://demo-gym.up.railway.app/login"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            m: 2,
            py: 1,
            px: 3,
            width: {
              xs: 'fit-content',
              md: 'calc(100% - 2rem)'
            },
            fontSize: '1.2rem',
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: 'primary.main',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Panel de Admin
        </Button>

        {/* Separador */}
        <Box
          sx={{
            width: '100%',
            height: '1px',
            bgcolor: 'divider',
          }}
        />

        {/* Título de DNIs de ejemplo */}
        <Box sx={{
          overflow: 'auto',
          '&::-webkit-scrollbar': {
              width: '0.375rem',
              height: '0.375rem'
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: '#f0f0f0',
              borderRadius: '0.3rem'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#c0c0c0',
              borderRadius: '0.3rem',
              '&:hover': {
                background: '#a0a0a0'
              }
            }
        }}>
          
    <Typography 
          variant="h6" 
          sx={{ 
            my: 1,
            mx: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'text.secondary',
            textAlign: 'left',
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          DNIs de ejemplo:
        </Typography>
        <Box 
          sx={{ 
            p: 2,
            pt: 0,
            display: 'flex', 
            flexDirection: {
              xs: 'row',
              md: 'column'
            },
            flexWrap: {
              xs: 'wrap',
              md: 'nowrap'
            },
            gap: 2,
            flex: 1,
            overflow: 'auto',
            
          }}
        >
          
          {dniExamples.map(({ dni, label, icon: Icon, color }) => (
            <Box
              key={dni}
              onClick={() => setDni(dni)}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: {
                  xs: 'calc(50% - 0.5rem)',
                  sm: 'calc(33.33% - 0.67rem)',
                  md: '100%'
                },
                flexShrink: 0,
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: {
                    xs: 'translateY(-2px)',
                    md: 'translateX(-4px)'
                  }
                }
              }}
            >
              <Icon 
                sx={{ 
                  fontSize: {
                    xs: '1.8rem',
                    sm: '2rem',
                    md: '2.2rem'
                  },
                  color: `${color}.main`,
                  flexShrink: 0
                }} 
              />
              <Box sx={{ 
                minWidth: 0,
                flex: 1
              }}>
                <Typography 
                  sx={{ 
                    fontSize: {
                      xs: '1rem',
                      sm: '1.1rem',
                      md: '1.2rem'
                    },
                    fontWeight: 500,
                    color: 'text.primary',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {label}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: {
                      xs: '0.9rem',
                      sm: '1rem',
                      md: '1.1rem'
                    },
                    color: 'text.secondary',
                    lineHeight: 1.2
                  }}
                >
                  {dni}
                </Typography>
              </Box>
            </Box>
          ))}
          </Box>
    </Box>
          
      </Paper>

      {/* Overlays (Loading, Error, Response) */}
      {isLoading ? (
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
          }}
        >
          <CircularProgress 
            size={60} 
            sx={{
              color: 'secondary.main',
            }}
          />
        </Box>
      ) : networkError ? (
        <NetworkError error={networkError} onClose={handleClose} />
      ) : response && (
        <AccessResponseComponent 
          response={response}
          onClose={handleClose}
        />
      )}
    </Box>
  )
}

export default App
