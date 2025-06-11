import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
	Button,
	Typography,
	Divider,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import { User } from '../../types/users.types';

interface PaymentConfirmModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	user: User;
}

const PaymentConfirmModal = ({ open, onClose, onConfirm, user }: PaymentConfirmModalProps) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
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
				<Typography variant='h6' component='span'>
					Añadir Pago
				</Typography>
			</DialogTitle>

			<Divider />

			<DialogContent sx={{ p: 3 }}>
				<DialogContentText>
					Añadir pago para{' '}
					<strong>
						{user.name} {user.lastName}
					</strong>
					?
				</DialogContentText>
			</DialogContent>

			<Divider />

			<DialogActions sx={{ p: 2.5 }}>
				<Button onClick={onClose} color='inherit'>
					No, Cerrar
				</Button>
				<Button variant='contained' onClick={onConfirm} sx={{ px: 3 }}>
					Sí, Añadir Pago
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PaymentConfirmModal; 