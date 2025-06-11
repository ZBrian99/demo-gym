import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  TextField,
  Stack,
  Alert,
  Box,
} from '@mui/material';
import { User } from '../../types/users.types';

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User;
  isLoading?: boolean;
}

const DeleteUserModal = ({ open, onClose, onConfirm, user, isLoading }: DeleteUserModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = `${user.name} ${user.lastName}`;
  const isValid = confirmText === expectedText;

  useEffect(() => {
    if (!open) {
      setConfirmText('');
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
   
      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography component="span">
              ¿Está seguro de que desea eliminar a{' '}
            </Typography>
            <Typography component="span" fontWeight="bold">
              {expectedText}
            </Typography>
            <Typography component="span">?</Typography>
          </Box>
          <Alert severity="error" sx={{ py: 0.5 }}>
            Todo el contenido y registros asociados serán eliminados permanentemente.
          </Alert>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Para confirmar, escribe el nombre y apellido del cliente:
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={expectedText}
              autoComplete="off"
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading || !isValid}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
