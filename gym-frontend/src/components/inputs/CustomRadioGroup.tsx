import { useFormContext, Controller } from 'react-hook-form';
import {
	Radio,
	RadioGroup,
	FormControl,
	FormControlLabel,
	FormLabel,
	FormHelperText,
	TextFieldProps,
} from '@mui/material';

type CustomRadioGroupProps = {
	label: string;
	name: string;
	options: { label: string; value: string }[];
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	fullWidth?: boolean;
	props?: TextFieldProps;
};

export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
	label,
	name,
	options,
	required = false,
	disabled = false,
	readOnly = false,
	fullWidth = false,
	props,
}) => {
	const { control, formState } = useFormContext();
	const hasError = !!formState.errors[name];

	return (
		<FormControl required={required} error={hasError} component='fieldset' fullWidth={fullWidth} {...props}>
			<FormLabel sx={{ marginBottom: '0.5rem', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
				{label}
			</FormLabel>
			<Controller
				name={name}
				control={control}
				defaultValue=''
				render={({ field }) => (
					<RadioGroup
						{...field}
						onChange={(e) => !readOnly && field.onChange(e.target.value)} // Condicional para readOnly
					>
						{options.map((option) => (
							<FormControlLabel
								key={option.value}
								value={option.value}
								control={<Radio disabled={disabled} />}
								label={option.label}
							/>
						))}
					</RadioGroup>
				)}
			/>
			{hasError && <FormHelperText>{formState.errors[name]?.message as string}</FormHelperText>}
		</FormControl>
	);
};
