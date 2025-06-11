import { useState, useCallback } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UserModal from '../components/modals/UserModal';
import DeleteUserModal from '../components/modals/DeleteUserModal';
import UsersTable from '../components/UsersTable';
import { User } from '../types/users.types';
import { useAppDispatch } from '../../../app/hooks';
import { showSnackbar } from '../../../app/appSlice';
import { useDeleteUserMutation, useGetUsersQuery } from '../api/usersApi';
import AddPaymentModal from '../components/modals/AddPaymentModal';
import PaymentConfirmModal from '../components/modals/PaymentConfirmModal';

const UsersPage = () => {
	// const { isFetching } = useGetUsersQuery({});
	const [modalState, setModalState] = useState<{
		isOpen: boolean;
		user?: User;
	}>({
		isOpen: false,
	});

	const [deleteModalState, setDeleteModalState] = useState<{
		isOpen: boolean;
		user?: User;
	}>({
		isOpen: false,
	});

	const [paymentModalState, setPaymentModalState] = useState<{
		isOpen: boolean;
		user?: User;
	}>({
		isOpen: false,
	});

	const [paymentConfirmState, setPaymentConfirmState] = useState<{
		isOpen: boolean;
		user?: User;
	}>({
		isOpen: false,
	});

	const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
	const dispatch = useAppDispatch();

	const handleOpenModal = useCallback((user?: User) => {
		setModalState({
			isOpen: true,
			user,
		});
	}, []);

	const handleCloseModal = useCallback(() => {
		setModalState({
			isOpen: false,
			user: undefined,
		});
	}, []);

	const handleOpenDeleteModal = useCallback((user: User) => {
		setDeleteModalState({
			isOpen: true,
			user,
		});
	}, []);

	const handleCloseDeleteModal = useCallback(() => {
		setDeleteModalState({
			isOpen: false,
			user: undefined,
		});
	}, []);

	const handleDelete = useCallback(async () => {
		if (!deleteModalState.user) return;

		try {
			await deleteUser(deleteModalState.user.id).unwrap();
			dispatch(
				showSnackbar({
					message: 'Cliente eliminado correctamente',
					severity: 'success',
				})
			);
			handleCloseDeleteModal();
		} catch (error) {
			dispatch(
				showSnackbar({
					message: 'Error al eliminar el cliente',
					severity: 'error',
				})
			);
		}
	}, [deleteUser, dispatch, deleteModalState.user, handleCloseDeleteModal]);

	const handleOpenPaymentModal = useCallback((user: User) => {
		setPaymentModalState({
			isOpen: true,
			user,
		});
	}, []);

	const handleClosePaymentModal = useCallback(() => {
		setPaymentModalState({
			isOpen: false,
			user: undefined,
		});
	}, []);

	const handleOpenPaymentConfirm = useCallback((user: User) => {
		setPaymentConfirmState({
			isOpen: true,
			user,
		});
	}, []);

	const handleClosePaymentConfirm = useCallback(() => {
		setPaymentConfirmState({
			isOpen: false,
			user: undefined,
		});
	}, []);

	const handlePaymentConfirm = useCallback((user: User) => {
		handleClosePaymentConfirm();
		handleOpenPaymentModal(user);
	}, [handleClosePaymentConfirm, handleOpenPaymentModal]);

	return (
		<Stack spacing={4} flexGrow={1} py={2} px={1.5}>
			<Stack direction='row' flexWrap='wrap' justifyContent='space-between' alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
				<Typography
					variant='h3'
					sx={{
						fontSize: {
							xs: '1.5rem',
							sm: '2rem',
						},
						whiteSpace: 'nowrap',
					}}
				>
					Clientes
				</Typography>
				<Button
					variant='contained'
					startIcon={<PersonAddIcon />}
					onClick={() => handleOpenModal()}
					sx={{
						fontSize: {
							xs: '0.875rem',
							sm: '1rem',
						},
					}}
				>
					Registrar Cliente
				</Button>
			</Stack>
			<UsersTable onEdit={handleOpenModal} onDelete={handleOpenDeleteModal} onAddPayment={handleOpenPaymentModal} />

			<UserModal 
				open={modalState.isOpen} 
				onClose={handleCloseModal} 
				user={modalState.user}
				onUserCreated={handleOpenPaymentConfirm}
			/>

			{deleteModalState.user && (
				<DeleteUserModal
					open={deleteModalState.isOpen}
					onClose={handleCloseDeleteModal}
					onConfirm={handleDelete}
					user={deleteModalState.user}
					isLoading={isDeleting}
				/>
			)}

			{paymentModalState.user && (
				<AddPaymentModal
					open={paymentModalState.isOpen}
					onClose={handleClosePaymentModal}
					user={paymentModalState.user}
				/>
			)}

			{paymentConfirmState.user && (
				<PaymentConfirmModal
					open={paymentConfirmState.isOpen}
					onClose={handleClosePaymentConfirm}
					onConfirm={() => handlePaymentConfirm(paymentConfirmState.user!)}
					user={paymentConfirmState.user}
				/>
			)}
		</Stack>
	);
};

export default UsersPage;
