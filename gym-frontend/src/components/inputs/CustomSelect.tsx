import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField, FormControl, FormHelperText, FormLabel, TextFieldProps } from '@mui/material';

type Option = {
	label: string;
	value: string;
};

type CustomSelectProps = {
	label: string;
	name: string;
	options: Option[];
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	fullWidth?: boolean;
	sx?: TextFieldProps['sx'];
	shrink?: boolean;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
	label,
	name,
	options,
	required = false,
	disabled = false,
	readOnly = false,
	fullWidth = false,
	sx,
	shrink = true,
}) => {
	const { control, formState, trigger } = useFormContext();
	const hasError = !!formState.errors[name];

	const handleBlur = () => {
		trigger(name);
	};

	return (
		<FormControl required={required} error={hasError} fullWidth={fullWidth} sx={sx}>
			{!shrink && (
				<FormLabel sx={{ marginBottom: '0.5rem', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
					{label}
				</FormLabel>
			)}
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Autocomplete
						options={options}
						value={options.find((option) => option.value === field.value) || null}
						getOptionLabel={(option) => option.label}
						onChange={(_, value) => field.onChange(value ? value.value : '')}
						disabled={disabled}
						readOnly={readOnly}
						fullWidth={fullWidth}
						onBlur={handleBlur}
						renderInput={(params) => (
							<TextField
								{...params}
								label={shrink ? label : undefined}
								sx={sx}
								required={required}
								variant='outlined'
								size='small'
                error={hasError}
                								// inputProps: { onBlur: handleBlur },

							/>
						)}
					/>
				)}
			/>
			{hasError && <FormHelperText>{formState.errors[name]?.message as string}</FormHelperText>}
		</FormControl>
	);
};
