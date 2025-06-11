import { useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText, FormLabel, TextField, TextFieldProps } from '@mui/material';

type CustomTextInputProps = {
	label: string;
	placeholder?: string;
	name: string;
	type?: 'text' | 'email';
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	sx?: TextFieldProps['sx'];
	fullWidth?: boolean;
	shrink?: boolean;
	props?: TextFieldProps;
};

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
	label,
	placeholder,
	name,
	type = 'text',
	required = false,
	disabled = false,
	readOnly = false,
	shrink = true,
	sx,
	fullWidth = false,
	props,
}) => {
	const { register, formState } = useFormContext();
	const hasError = !!formState.errors?.[name];

	return (
		<FormControl fullWidth={fullWidth} disabled={disabled} required={required} error={hasError} sx={sx}>
			{!shrink && (
				<FormLabel sx={{ marginBottom: '0.5rem', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
					{label}
				</FormLabel>
			)}
			<TextField
				{...register(name)}
				{...props}
				type={type}
				label={shrink ? label : undefined}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				error={hasError}
				helperText={hasError ? (formState.errors?.[name]?.message as string) : undefined}
				size='small'
				autoComplete={type === 'email' ? 'new-email' : 'off'}
				sx={sx}
				slotProps={{
					input: {
						readOnly,
					},
				}}
			/>
		</FormControl>
	);
};
