import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import { Currency } from '../features/users/types/enums';

// Extender dayjs con los plugins
dayjs.extend(utc);
dayjs.extend(tz);

export const formatDate = (date: string | null) => {
	if (!date) return '-';
	return dayjs(date).tz('America/Argentina/Buenos_Aires').format('DD/MM/YYYY');
};

export const formatDateTime = (date: string | null) => {
	if (!date) return '-';
	return dayjs(date).tz('America/Argentina/Buenos_Aires').format('DD/MM/YYYY HH:mm');
};
export const formatCurrency = (amount: number, currency: Currency) => {
	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount);
};