import {
	Drawer,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Tooltip,
	useTheme,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
	isExpanded: boolean;
	onToggle: () => void;
	onLogout: () => void;
	expandedWidth: number;
	collapsedWidth: number;
}

const MenuToggleItem = ({ icon, onClick, isExpanded }: { icon: JSX.Element; onClick: () => void; isExpanded: boolean }) => {


	return (
			<ListItemButton
			onClick={onClick}
			sx={{
        justifyContent: 'flex-end',
        py: 1.5,
			}}
		>
			<ListItemIcon
				sx={{
					minWidth: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
			</ListItemIcon>
		</ListItemButton>
	);
};

const MenuItem = ({ text, icon, path, onClick, isExpanded }: { text: string; icon: JSX.Element; path?: string; onClick?: () => void; isExpanded: boolean }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const isSelected = path ? location.pathname === path : false;

	const item = (
		<ListItemButton
			onClick={onClick || (path ? () => navigate(path) : undefined)}
			selected={isSelected}
		>
			<ListItemIcon
				sx={{
					minWidth: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
			</ListItemIcon>
			<ListItemText
				primary={text}
				sx={{
					ml: 2.5,
					whiteSpace: 'nowrap',
				}}
			/>
		</ListItemButton>
	);

	return (
		<Tooltip title={text} placement='right' disableHoverListener={isExpanded} arrow>
			<span>{item}</span>
		</Tooltip>
	);
};

const Sidebar = ({ isExpanded, onToggle, onLogout, expandedWidth, collapsedWidth }: SidebarProps) => {
	const theme = useTheme();
	const drawerWidth = isExpanded ? expandedWidth : collapsedWidth;

	const menuItems = [
		// { text: 'Dashboard', icon: <Home fontSize='medium' />, path: '/dashboard' },
		{ text: 'Clientes', icon: <PeopleIcon fontSize='medium' />, path: '/users' },
		{ text: 'Accesos', icon: <SecurityIcon fontSize='medium' />, path: '/access' },
	];

	return (
		<Drawer
			variant='permanent'
			sx={{
				'& .MuiDrawer-paper': {
					position: 'fixed',
					left: '1rem',
					top: '1rem',
					bottom: '1rem',
					width: drawerWidth,
					height: 'auto',
					borderRadius: '1rem',
					border: 'none',
					boxShadow: theme.shadows[1],
					transition: theme.transitions.create('width', {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.enteringScreen,
					}),
					overflowX: 'hidden',
				},
			}}
		>
			<List
				sx={{
					p: 0,
				}}
			>
				<MenuToggleItem
					icon={isExpanded ? <MenuOpenIcon fontSize='medium' /> : <MenuIcon fontSize='medium' />}
					onClick={onToggle}
					isExpanded={isExpanded}
				/>
			</List>
			<Divider />
			<List sx={{ flexGrow: 1 }}>
				{menuItems.map((item) => (
					<MenuItem key={item.text} {...item} isExpanded={isExpanded} />
				))}
			</List>
			<Divider />
			<List
				sx={{
					p: 0,
				}}
			>
				<MenuItem text='Cerrar sesión' icon={<LogoutIcon fontSize='medium' />} onClick={onLogout} isExpanded={isExpanded} />
			</List>
		</Drawer>
	);
};

export default Sidebar;
