import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
	palette: {
		mode: 'light',
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
			default: '#F8FAFC',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#0F172A',
			secondary: '#475569',
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
		divider: 'rgba(0, 0, 0, 0.12)',
	},
	typography: {
		fontFamily: ['Roboto', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
		h1: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 900,
			fontSize: '3rem',
		},
		h2: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 700,
			fontSize: '2.25rem',
		},
		h3: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 700,
			fontSize: '2rem',
		},
		h4: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 500,
			fontSize: '1.5rem',
		},
		h5: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 500,
			fontSize: '1.25rem',
		},
		h6: {
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 500,
			fontSize: '1rem',
		},
		subtitle1: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '1rem',
			fontWeight: 500,
		},
		subtitle2: {
			fontFamily: 'Roboto, sans-serif',
			fontSize: '.875rem',
			fontWeight: 500,
		},
		body1: {
			fontSize: '1rem',
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 400,
		},
		body2: {
			fontSize: '.875rem',
			fontFamily: 'Roboto, sans-serif',
			fontWeight: 400,
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					'&::-webkit-scrollbar, & *::-webkit-scrollbar': {
						width: 8,
						height: 8,
					},
					'&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
						borderRadius: 16,
						backgroundColor: '#C2BEC3',
					},
					'&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
						backgroundColor: '#ABA7AC',
					},
					'&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
						backgroundColor: '#ABA7AC',
					},
					'&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
						backgroundColor: '#ABA7AC',
					},
				},
			},
		},

		MuiSvgIcon: {
			styleOverrides: {
				root: {},
			},
			defaultProps: {
				fontSize: 'small',
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					whiteSpace: 'nowrap',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
			defaultProps: {
				size: 'small',
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					position: 'relative',
					borderRadius: '.5rem',
					// '& th:last-child': {
					// 	// position: 'sticky',
					// 	right: 0,
					// 	// zIndex: 2,
					// 	backgroundColor: 'inherit',
					// },
					// '& td:last-child': {
					// 	// position: 'sticky',
					// 	right: 0,
					// 	backgroundColor: 'inherit',
					// },
					// '& .MuiTableCell-root': {
					// 	borderBottom: '1px solid #E0E0E0',
					// 	borderRight: '1px solid #E0E0E0',
					// },
					'& .MuiTableCell-root:last-child': {
						// border: 'none',
					},
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					'& .MuiTableRow-root:first-of-type': {
						backgroundColor: '#F0EFF1',
					},
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					'&:nth-of-type(even)': {
						backgroundColor: '#f7f7f7',
						'&:hover': {
							backgroundColor: '#ebebeb',
						},
					},
					'&:nth-of-type(odd)': {
						backgroundColor: '#FCFCFC',
						'&:hover': {
							backgroundColor: '#ebebeb',
						},
					},
					'&:last-child td': { borderBottom: 0 },
					// '& .MuiTableCell-root': {
					// 	borderBottom: '1px solid #E0E0E0',
					// 	borderRight: '1px solid #E0E0E0',
					// },
					'& .MuiTableCell-root:last-child': {
						// border: 'none',
					},
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					whiteSpace: 'nowrap',
					padding: '0 1rem',
					verticalAlign: 'bottom',
					borderBottom: '1px solid #E0E0E0',
					borderRight: '1px solid #E0E0E0',
					'&:first-of-type': {
						verticalAlign: 'middle',
					},
					'&:last-of-type': {
						borderRight: 'none',
					},
				},
				head: {
					padding: '.75rem 1rem',
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
					'&.MuiAlert-standardSuccess': {
						backgroundColor: '#DCFCE7',
						borderColor: '#A7E8C5',
						borderLeft: '3px solid #22C55E',
					},
					'&.MuiAlert-standardError': {
						backgroundColor: '#FEE2E2',
						borderColor: '#FBB4B4',
						borderLeft: '3px solid #EF4444',
					},
					'&.MuiAlert-standardWarning': {
						backgroundColor: '#FEF9C3',
						borderColor: '#FCE4A7',
						borderLeft: '3px solid #F5BE0B',
					},
					'&.MuiAlert-standardInfo': {
						backgroundColor: '#E0F2FE',
						borderColor: '#A7D8F4',
						borderLeft: '3px solid #0EA5E9',
					},
				},
			},
		},
	},
});
