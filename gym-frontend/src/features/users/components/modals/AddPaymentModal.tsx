import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button,  Typography, Divider, Box } from '@mui/material';
import dayjs from 'dayjs';
import { User } from '../../types/users.types';
import { useAppDispatch } from '../../../../app/hooks';
import { showSnackbar } from '../../../../app/appSlice';
import { CustomTextInput, CustomDatePicker, CustomSelect, CustomTextarea } from '../../../../components/inputs';
import { Currency, Modality } from '../../types/enums';
import { useCreatePaymentMutation } from '../../api/usersApi';
import PaymentIcon from '@mui/icons-material/Payment';

// Clave para localStorage
const LAST_PAYMENT_KEY = 'lastPaymentAmount';

const paymentSchema = z.object({
  amount: z.string().min(1, 'El monto es requerido'),
  currency: z.nativeEnum(Currency),
  modality: z.nativeEnum(Modality),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
  comments: z.string().optional(),
  discount: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const AddPaymentModal = ({ open, onClose, user }: AddPaymentModalProps) => {
  const [createPayment, { isLoading }] = useCreatePaymentMutation();
  const dispatch = useAppDispatch();

  // Obtener el último monto guardado
  const getLastPaymentAmount = () => {
    try {
      return localStorage.getItem(LAST_PAYMENT_KEY) || '';
    } catch (error) {
      console.warn('Error al leer de localStorage:', error);
      return '';
    }
  };

  const methods = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onBlur',
    defaultValues: {
      amount: getLastPaymentAmount(),
      currency: Currency.ARS,
      modality: user.enrollment?.modality || Modality.FREE,
      startDate: '',
      endDate: '',
      comments: '',
      discount: '',
    },
  });

  useEffect(() => {
    if (open) {
      // Solo actualizamos las fechas y la modalidad, mantenemos el monto anterior
      methods.reset((formValues) => ({
        ...formValues,
        modality: user.enrollment?.modality || Modality.FREE,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
        amount: formValues.amount || getLastPaymentAmount(), // Mantener el monto actual o usar el último guardado
      }));
    }
  }, [open, user.enrollment?.modality]);

  const onSubmit = async (data: PaymentFormData) => {
    if (!user.enrollment?.id) {
      dispatch(
        showSnackbar({
          message: 'El usuario no tiene una inscripción activa',
          severity: 'error',
        })
      );
      return;
    }

    try {
      // Guardar el monto en localStorage antes de enviar
      try {
        localStorage.setItem(LAST_PAYMENT_KEY, data.amount);
      } catch (error) {
        console.warn('Error al guardar en localStorage:', error);
      }

      await createPayment({
        enrollmentId: user.enrollment.id,
        amount: Number(data.amount),
        currency: data.currency,
        modality: data.modality,
        startDate: dayjs(data.startDate).utc().toDate(),
        endDate: dayjs(data.endDate).utc().toDate(),
        comments: data.comments,
        discount: data.discount ? Number(data.discount) : undefined,
      }).unwrap();

      dispatch(
        showSnackbar({
          message: `Pago registrado correctamente para ${user.name} ${user.lastName}`,
          severity: 'success',
        })
      );
      onClose();
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Error al registrar el pago',
          severity: 'error',
        })
      );
    }
  };

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
				<PaymentIcon color='primary' />
				<Typography variant='h6' component='div'>
					Añadir Pago: {`${user.name} ${user.lastName}`}
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
							<CustomTextInput label='Monto' name='amount' required />
							<CustomSelect
								label='Moneda'
								name='currency'
								required
								options={[
									{ value: Currency.ARS, label: 'ARS' },
									{ value: Currency.USD, label: 'USD' },
								]}
							/>

							<CustomSelect
								label='Modalidad'
								name='modality'
								required
								options={[
									{ value: Modality.FREE, label: 'Libre' },
									{ value: Modality.THREE, label: '3 Días' },
									{ value: Modality.TWO, label: '2 Días' },
								]}
							/>
							<CustomTextInput label='Descuento' name='discount' />

							<CustomDatePicker label='Fecha de Inicio' name='startDate' required />
							<CustomDatePicker label='Fecha de Fin' name='endDate' required />

							<Box sx={{ gridColumn: '1 / -1' }}>
								<CustomTextarea label='Comentarios' name='comments' fullWidth />
							</Box>
						</Box>
					</DialogContent>

					<Divider />

					<DialogActions sx={{ p: 2.5 }}>
						<Button onClick={onClose} color='inherit'>
							Cancelar
						</Button>
						<Button variant='contained' disabled={isLoading} sx={{ px: 3 }} onClick={methods.handleSubmit(onSubmit)}>
							Añadir Pago
						</Button>
					</DialogActions>
				</form>
			</FormProvider>
		</Dialog>
	);
};

export default AddPaymentModal;
