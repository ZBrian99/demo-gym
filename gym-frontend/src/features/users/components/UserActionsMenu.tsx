import { memo } from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';
import { User } from '../types/users.types';

interface UserActionsMenuProps {
	open: boolean;
	anchorEl: HTMLElement | null;
	user: User | null;
	onClose: () => void;
	onNavigate: (id: string) => void;
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
	onAddPayment: (user: User) => void;
}

const UserActionsMenu = memo(
	({ open, anchorEl, user, onClose, onNavigate, onEdit, onDelete, onAddPayment }: UserActionsMenuProps) => {
		if (!user) return null;

		const handleAction = (action: () => void) => {
			action();
			onClose();
		};

		return (
			<Menu
				id='user-actions-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={onClose}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				disableScrollLock
				keepMounted
			>
				<MenuItem onClick={() => handleAction(() => onNavigate(user.id))}>
					<ListItemIcon>
						<VisibilityIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Ver Detalles</ListItemText>
				</MenuItem>

				<MenuItem onClick={() => handleAction(() => onAddPayment(user))}>
					<ListItemIcon>
						<PaymentIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Añadir Pago</ListItemText>
				</MenuItem>

				<MenuItem onClick={() => handleAction(() => onEdit(user))}>
					<ListItemIcon>
						<EditIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Editar</ListItemText>
				</MenuItem>

				<MenuItem onClick={() => handleAction(() => onDelete(user))}>
					<ListItemIcon>
						<DeleteIcon fontSize='small' />
					</ListItemIcon>
					<ListItemText>Eliminar</ListItemText>
				</MenuItem>
			</Menu>
		);
	}
);


export default UserActionsMenu;
