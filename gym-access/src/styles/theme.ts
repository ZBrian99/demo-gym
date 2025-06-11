import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: {
			main: '#151b4f',
			light: '#2a3373',
			dark: '#0c1238',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#00E5FF',
			light: '#6EFFFF',
			dark: '#00B2CC',
			contrastText: '#000000',
		},
		background: {
			default: '#FAFAFA',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#212121',
			secondary: '#424242',
		},
		error: {
			main: '#EF4444',
			light: '#ff7676',
			dark: '#DC2626',
		},
		warning: {
			main: '#F5BE0B',
			light: '#FFE580',
			dark: '#D4A304',
		},
		info: {
			main: '#0EA5E9',
			light: '#7DD3FC',
			dark: '#0284C7',
		},
		success: {
			main: '#22C55E',
			light: '#86EFAC',
			dark: '#16A34A',
		},
	},
	shape: {
		borderRadius: 16,
	},
	typography: {
		fontFamily: '"Poppins", "Roboto", sans-serif',
		h1: {
			fontWeight: 700,
			fontSize: '3rem',
		},
		h2: {
			fontWeight: 600,
			fontSize: '2rem',
		},
		h5: {
			fontWeight: 600,
			fontSize: '1.5rem',
			letterSpacing: 0.5,
		},
		h6: {
			fontWeight: 500,
			fontSize: '1.25rem',
			letterSpacing: 0.25,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: '#FAFAFA',
					minHeight: '100svh',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: 'outlined',
			},
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						borderRadius: 16,
						backgroundColor: '#fff',
						'&.Mui-focused': {
							backgroundColor: '#fff',
							boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
						},
					},
				},
			},
		},
	},
});