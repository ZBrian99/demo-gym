import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from './styles/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import GlobalStyles from './styles/globalStyles';
import AppRoutes from './routes/AppRoutes';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

const App = () => {
	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			<GlobalStyles />
			<Router>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<AppRoutes />
				</LocalizationProvider>
			</Router>
		</ThemeProvider>
	);
};

export default App;
