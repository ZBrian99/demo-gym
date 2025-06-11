import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material';
import { AppState } from '../types/app.types';

const initialState: AppState = {
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; severity: AlertColor }>
    ) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    hideSnackbar: (state) => {
      state.snackbar = {
        ...state.snackbar,
        open: false,
      };
    },
  },
});

export const {
  showSnackbar,
  hideSnackbar,
} = appSlice.actions;

export default appSlice.reducer; 