import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/slices/authSlice';
import Sidebar from './components/Sidebar';
import AppSnackbar from '../components/common/AppSnackbar';
import MobileNavigation from './components/MobileNavigation';

const DRAWER_WIDTH = 224;
const DRAWER_COLLAPSED_WIDTH = 56;
const MOBILE_NAV_HEIGHT = 56; 

const Layout = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isExpanded, setIsExpanded] = useState(false);

	const handleLogout = () => {
		dispatch(logout());
		navigate('/login');
	};

	const handleToggle = () => setIsExpanded((prev) => !prev);

	return (
		<Box>
			{!isMobile ? (
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: `${isExpanded ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH}px 1fr`,
						gap: 2,
						transition: theme.transitions.create('grid-template-columns', {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
						p: 2,
					}}
				>
					<Sidebar
						isExpanded={isExpanded}
						onToggle={handleToggle}
						onLogout={handleLogout}
						expandedWidth={DRAWER_WIDTH}
						collapsedWidth={DRAWER_COLLAPSED_WIDTH}
					/>
					<Box
						component='main'
						sx={{
							minHeight: 'calc(100vh - 2rem)',
							py: 1.5,
							px: 2,
							bgcolor: theme.palette.background.paper,
							display: 'flex',
							flexDirection: 'column',
							boxShadow: theme.shadows[1],
							borderRadius: '1rem',
							overflowX: 'hidden',
							width: '100%',
							maxWidth: '100rem',
							mx: 'auto',
						}}
					>
						<Outlet />
					</Box>
				</Box>
			) : (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						minHeight: '100vh',
					}}
				>
					<Box
						component='main'
						sx={{
							flexGrow: 1,
							py: 1.5,
							px: 2,
							bgcolor: theme.palette.background.paper,
							overflowX: 'hidden',
							width: '100%',
							pb: `${MOBILE_NAV_HEIGHT + 16}px`,
						}}
					>
						<Outlet />
					</Box>
					<MobileNavigation onLogout={handleLogout} />
				</Box>
			)}
			<AppSnackbar />
		</Box>
	);
};

export default Layout;
