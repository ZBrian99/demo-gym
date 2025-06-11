import { useEffect } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	Divider,
	Switch,
	FormControlLabel,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import { CreateUserDto, User } from '../../types/users.types';
import { useCreateUserMutation, useUpdateUserMutation } from '../../api/usersApi';
import { useAppDispatch } from '../../../../app/hooks';
import { showSnackbar } from '../../../../app/appSlice';
import { CustomTextInput, CustomDatePicker } from '../../../../components/inputs';

const userSchema = z.object({
	name: z
		.string()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.max(50, 'El nombre no puede tener más de 50 caracteres'),
	lastName: z
		.string()
		.min(2, 'El apellido debe tener al menos 2 caracteres')
		.max(50, 'El apellido no puede tener más de 50 caracteres'),
	dni: z
		.string()
		.min(7, 'El DNI debe tener al menos 7 caracteres')
		.max(10, 'El DNI no puede tener más de 10 caracteres'),
	phone: z
		.string()
		.min(8, 'El teléfono debe tener al menos 8 caracteres')
		.max(15, 'El teléfono no puede tener más de 15 caracteres'),
	email: z.string().email('Ingrese un correo electrónico válido').optional().or(z.literal('')),
	birthDate: z.string().optional().or(z.literal('')),
	active: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
	open: boolean;
	onClose: () => void;
	user?: User;
	onUserCreated?: (user: User) => void;
}

const UserModal = ({ open, onClose, user, onUserCreated }: UserModalProps) => {
	const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
	const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
	const dispatch = useAppDispatch();

	const methods = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		mode: 'onBlur',
		defaultValues: {
			name: '',
			lastName: '',
			dni: '',
			phone: '',
			email: '',
			birthDate: '',
			active: true,
		},
	});

	const isActive = useWatch({
		control: methods.control,
		name: 'active',
	});

	useEffect(() => {
		if (user) {
			methods.reset({
				name: user.name,
				lastName: user.lastName,
				dni: user.dni,
				phone: user.phone,
				email: user.email || undefined,
				birthDate: user.birthDate ? dayjs(user.birthDate).format('YYYY-MM-DD') : undefined,
				active: user.active,
			});
		} else {
			methods.reset({
				name: '',
				lastName: '',
				dni: '',
				phone: '',
				email: '',
				birthDate: '',
				active: true,
			});
		}
	}, [user, methods]);

	const onSubmit = async (data: UserFormData) => {
		try {
			// Capitalizar primera letra de nombre y apellido y formatear fecha
			const formattedData = {
				...data,
				name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
				lastName: data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1),
				birthDate: data.birthDate ? dayjs(data.birthDate).toISOString() : undefined,
			};

			if (user) {
				await updateUser({
					id: user.id,
					data: formattedData,
				}).unwrap();
				dispatch(
					showSnackbar({
						message: 'Cliente actualizado correctamente',
						severity: 'success',
					})
				);
				onClose();
			} else {
				const createdUser = await createUser(formattedData as CreateUserDto).unwrap();

				dispatch(
					showSnackbar({
						message: 'Cliente registrado correctamente',
						severity: 'success',
					})
				);

				onClose();
				methods.reset();

				if (onUserCreated) {
					onUserCreated(createdUser);
				}
			}
		} catch (error: any) {
			// Extraer el mensaje de error del backend
			const errorMessage = error.data?.message || 
				(Array.isArray(error.data?.errors) ? error.data.errors[0] : 'Error al crear el cliente');
			
			dispatch(
				showSnackbar({
					message: errorMessage,
					severity: 'error',
				})
			);
		}
	};

	const isLoading = isCreating || isUpdating;

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle
				sx={{
					p: 3,
					pb: 1,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
				}}
			>
				{user ? <EditIcon color='primary' /> : <PersonAddIcon color='primary' />}
				<Typography variant='h6' component='span'>
					{user ? `Editar Cliente: ${user.name} ${user.lastName}` : 'Registrar Cliente'}
				</Typography>
			</DialogTitle>

			<Divider />

			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<DialogContent sx={{ p: 3 }}>
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: {
									xs: '1fr', // Una columna en móvil
									sm: 'repeat(2, 1fr)', // Dos columnas en tablet y desktop
								},
								gap: 2.5,
							}}
						>
							<CustomTextInput label='Nombre' name='name' required />
							<CustomTextInput label='Apellido' name='lastName' required />
							<CustomTextInput label='DNI' name='dni' required />
							<CustomTextInput label='Teléfono' name='phone' required />
							<CustomTextInput
								label='Email'
								name='email'
								type='email'
								sx={{
									gridColumn: {
										xs: '1',
										sm: '1 / -1', // Ocupa ambas columnas
									},
								}}
							/>
							<CustomDatePicker
								label='Fecha de Nacimiento'
								name='birthDate'
								sx={{
									gridColumn: {
										xs: '1',
										sm: '1 / -1', // Ocupa ambas columnas
									},
								}}
							/>
							{user && (
								<FormControlLabel
									control={
										<Switch
											{...methods.register('active')}
											checked={isActive}
											onChange={(e) => methods.setValue('active', e.target.checked, { shouldDirty: true })}
											color="primary"
										/>
									}
									label={isActive ? 'Usuario Activo' : 'Usuario Suspendido'}
									sx={{
										gridColumn: {
											xs: '1',
											sm: '1 / -1',
										},
									}}
								/>
							)}
						</Box>
					</DialogContent>

					<Divider />

					<DialogActions sx={{ p: 2.5 }}>
						<Button onClick={onClose} color='inherit'>
							Cancelar
						</Button>
						<Button variant='contained' disabled={isLoading} sx={{ px: 3 }} onClick={methods.handleSubmit(onSubmit)}>
							{user ? 'Actualizar' : 'Registrar'}
						</Button>
					</DialogActions>
				</form>
			</FormProvider>
		</Dialog>
	);
};

export default UserModal;
