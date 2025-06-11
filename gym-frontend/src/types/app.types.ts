import { AlertColor } from '@mui/material';

export interface AppState {
  snackbar: SnackbarState;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}



