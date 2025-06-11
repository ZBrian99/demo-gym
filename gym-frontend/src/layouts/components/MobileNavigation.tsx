import { Paper, Button, Stack, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';

interface MobileNavigationProps {
	onLogout: () => void;
}

const MobileNavigation = ({ onLogout }: MobileNavigationProps) => {
	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();

	const menuItems = [
		// { label: 'Inicio', icon: <Home fontSize='medium' />, path: '/dashboard' },
		{ label: 'Clientes', icon: <PeopleIcon fontSize='medium' />, path: '/users' },
		{ label: 'Accesos', icon: <SecurityIcon fontSize='medium' />, path: '/access' },
		{ label: 'Salir', icon: <LogoutIcon fontSize='medium' />, onClick: onLogout },
	];

	return (
		<Paper
			sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				borderTopLeftRadius: '1rem',
				borderTopRightRadius: '1rem',
				overflow: 'hidden',
				zIndex: theme.zIndex.appBar,
				bgcolor: theme.palette.background.paper,
				padding: 0,
				width: '100%',
			}}
			elevation={3}
		>
			<Stack
				direction='row'
				sx={{
					justifyContent: 'space-around',
					padding: 0,
				}}
			>
				{menuItems.map((item) => (
					<Button
						key={item.label}
						onClick={item.onClick || (() => navigate(item.path!))}
						sx={{
              minWidth: 'auto',
              flex: 1,
							px: 2,
              py: 1,
							flexDirection: 'column',
							color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
						}}
					>
						{item.icon}
						{item.label}
					</Button>
				))}
			</Stack>
		</Paper>
	);
};

export default MobileNavigation;
