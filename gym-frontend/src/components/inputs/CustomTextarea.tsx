import { useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText, FormLabel, TextField, TextFieldProps } from '@mui/material';

type CustomTextareaProps = {
	label: string;
	name: string;
	rows?: number;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	sx?: TextFieldProps['sx'];
	fullWidth?: boolean;
	shrink?: boolean;
	props?: TextFieldProps;
};

export const CustomTextarea: React.FC<CustomTextareaProps> = ({
	label,
	name,
	rows = 4,
	required = false,
	disabled = false,
	readOnly = false,
	sx,
	fullWidth = false,
	shrink = true,
	props,
}) => {
	const { register, formState } = useFormContext();
	const hasError = !!formState.errors?.[name];

	return (
		<FormControl fullWidth={fullWidth} required={required} disabled={disabled} error={hasError}>
			{!shrink && (
				<FormLabel sx={{ marginBottom: '0.5rem', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
					{label}
				</FormLabel>
			)}
			<TextField
				{...register(name)}
				{...props}
				label={shrink ? label : undefined} // Mostrar el label solo si shrink es true
				multiline
				rows={rows}
				disabled={disabled}
				error={hasError}
				size='small'
				autoComplete='off'
				sx={sx}
				slotProps={{
					input: {
						readOnly,
					},
				}}
			/>
			{hasError && <FormHelperText>{formState.errors?.[name]?.message as string}</FormHelperText>}
		</FormControl>
	);
};
