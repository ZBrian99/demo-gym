// components/AppSnackbar.tsx
import React from 'react';
import { Snackbar, Alert, IconButton, AlertColor } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { hideSnackbar } from '../../app/appSlice';

const snackbarConfig: Record<AlertColor, { icon: JSX.Element }> = {
	success: { icon: <CheckCircleIcon fontSize='inherit' /> },
	error: { icon: <ErrorIcon fontSize='inherit' /> },
	warning: { icon: <WarningIcon fontSize='inherit' /> },
	info: { icon: <InfoIcon fontSize='inherit' /> },
};

const AppSnackbar: React.FC = () => {
	const dispatch = useAppDispatch();
	const snackbar = useAppSelector((state) => state.app.snackbar);

	const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') return;
		dispatch(hideSnackbar());
	};

	const config = snackbarConfig[snackbar.severity] || snackbarConfig.info;

	return (
		<Snackbar
			open={snackbar.open}
			autoHideDuration={6000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			>
			<Alert
				severity={snackbar.severity}
				icon={config.icon}
				action={
					<IconButton
						size='small'
						color='inherit'
						onClick={() => dispatch(hideSnackbar())}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				}
				sx={{ width: '100%' }}
			>
				{snackbar.message}
			</Alert>
		</Snackbar>
	);
};

export default AppSnackbar;
