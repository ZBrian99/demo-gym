import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Stack, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useGetUserByIdQuery, useDeleteUserMutation } from '../api/usersApi';
import { useAppDispatch } from '../../../app/hooks';
import { showSnackbar } from '../../../app/appSlice';
import LoadingScreen from '../../../components/common/LoadingScreen';
import UserDetailsTab from '../components/tabs/UserDetailsTab';
import UserEnrollmentTab from '../components/tabs/UserEnrollmentTab';
import UserPaymentsTab from '../components/tabs/UserPaymentsTab';
import UserAccessesTab from '../components/tabs/UserAccessesTab';
import UserModal from '../components/modals/UserModal';
import AddPaymentModal from '../components/modals/AddPaymentModal';
import DeleteUserModal from '../components/modals/DeleteUserModal';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`user-tabpanel-${index}`}
    aria-labelledby={`user-tab-${index}`}
    {...other}
    sx={{ flexGrow: 1 }}
  >
    {value === index && children}
  </Box>
);

const UserDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [tabIndex, setTabIndex] = useState(0);
  const { data: user, isLoading, error } = useGetUserByIdQuery(id!);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  }, []);

  const handleOpenEditModal = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  const handleOpenPaymentModal = useCallback(() => {
    setPaymentModalOpen(true);
  }, []);

  const handleClosePaymentModal = useCallback(() => {
    setPaymentModalOpen(false);
  }, []);

  const handleOpenDeleteModal = useCallback(() => {
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleMenuAction = useCallback((action: () => void) => {
    handleCloseMenu();
    action();
  }, [handleCloseMenu]);

  const handleDelete = useCallback(async () => {
    if (!user) return;

    try {
      await deleteUser(user.id).unwrap();
      dispatch(
        showSnackbar({
          message: 'Cliente eliminado correctamente',
          severity: 'success',
        })
      );
      navigate('/users');
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Error al eliminar el cliente',
          severity: 'error',
        })
      );
    }
  }, [user, deleteUser, dispatch, navigate]);

  if (isLoading) return <LoadingScreen />;

  if (error || !user) {
    return (
      <Typography color="error" textAlign="center">
        Error al cargar los detalles del usuario
      </Typography>
    );
  }

  return (
		<Stack spacing={2} py={2} px={1.5} flexGrow={1}>
			<Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2}>
				<Typography
					variant='h3'
					sx={{
						fontSize: {
							xs: '1.5rem',
							sm: '2rem',
						},
					}}
				>
					{`${user.name} ${user.lastName}`}
				</Typography>

				{/* Menú móvil */}
				<Box sx={{ display: { sm: 'block', md: 'none' } }}>
					<IconButton
						onClick={handleOpenMenu}
						size='large'
						edge='end'
						aria-label='acciones de usuario'
						sx={{
							backgroundColor: 'action.selected',
							'&:hover': {
								backgroundColor: 'action.hover',
							},
							width: '2.5rem',
							height: '2.5rem',
							m: 0,
						}}
					>
						<MoreVertIcon sx={{ color: 'text.primary' }} />
					</IconButton>
					<Menu
						disableScrollLock
						anchorEl={menuAnchorEl}
						open={Boolean(menuAnchorEl)}
						onClose={handleCloseMenu}
						transformOrigin={{ horizontal: 'right', vertical: 'top' }}
						anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
						// PaperProps={{
						// 	elevation: 2,
						// 	sx: {
						// 		minWidth: '200px',
						// 		mt: 1,
						// 	},
						// }}
						sx={{
							'& .MuiPaper-root': {
								minWidth: '180px',
							},
						}}
					>
						<MenuItem onClick={() => handleMenuAction(handleOpenPaymentModal)}>
							<ListItemIcon>
								<PaymentIcon fontSize='small' />
							</ListItemIcon>
							<ListItemText>Añadir Pago</ListItemText>
						</MenuItem>
						<MenuItem onClick={() => handleMenuAction(handleOpenEditModal)}>
							<ListItemIcon>
								<EditIcon fontSize='small' />
							</ListItemIcon>
							<ListItemText>Editar</ListItemText>
						</MenuItem>
						<MenuItem onClick={() => handleMenuAction(handleOpenDeleteModal)}>
							<ListItemIcon>
								<DeleteIcon fontSize='small' color='error' />
							</ListItemIcon>
							<ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
						</MenuItem>
					</Menu>
				</Box>

				{/* Botones desktop */}
				<Stack direction='row-reverse' spacing={1.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
					<Button variant='contained' startIcon={<PaymentIcon />} onClick={handleOpenPaymentModal}>
						Añadir Pago
					</Button>
					<Button variant='outlined' startIcon={<EditIcon />} onClick={handleOpenEditModal}>
						Editar
					</Button>
					<Button variant='outlined' color='error' startIcon={<DeleteIcon />} onClick={handleOpenDeleteModal}>
						Eliminar
					</Button>
				</Stack>
			</Stack>

			<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						mb: 3,
						'& .MuiTabs-root': {
							minHeight: { xs: '48px', sm: '64px' },
						},
						'& .MuiTab-root': {
							fontSize: { xs: '0.8rem', sm: '0.875rem' },
							minWidth: { xs: 'auto', sm: '160px' },
							p: { xs: '6px 12px', sm: '12px 16px' },
							minHeight: { xs: '48px', sm: '64px' },
						},
					}}
				>
					<Tabs
						value={tabIndex}
						onChange={handleTabChange}
						aria-label='user details tabs'
						variant='scrollable'
						scrollButtons='auto'
						allowScrollButtonsMobile
					>
						<Tab label='Detalles' id='user-tab-0' aria-controls='user-tabpanel-0' />
						<Tab label='Inscripción' id='user-tab-1' aria-controls='user-tabpanel-1' />
						<Tab label='Pagos' id='user-tab-2' aria-controls='user-tabpanel-2' />
						<Tab label='Accesos' id='user-tab-3' aria-controls='user-tabpanel-3' />
					</Tabs>
				</Box>

				<TabPanel value={tabIndex} index={0}>
					<UserDetailsTab user={user} />
				</TabPanel>
				<TabPanel value={tabIndex} index={1}>
					<UserEnrollmentTab user={user} />
				</TabPanel>
				<TabPanel value={tabIndex} index={2}>
					<UserPaymentsTab userId={user.id} />
				</TabPanel>
				<TabPanel value={tabIndex} index={3}>
					<UserAccessesTab userId={user.id} />
				</TabPanel>
			</Box>

			<UserModal open={editModalOpen} onClose={handleCloseEditModal} user={user} />

			{paymentModalOpen && <AddPaymentModal open={paymentModalOpen} onClose={handleClosePaymentModal} user={user} />}

			<DeleteUserModal
				open={deleteModalOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleDelete}
				user={user}
				isLoading={isDeleting}
			/>
		</Stack>
	);
};

export default UserDetailsPage; 