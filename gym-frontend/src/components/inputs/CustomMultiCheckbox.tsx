import { useFormContext, Controller } from 'react-hook-form';
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	FormHelperText,
	TextFieldProps,
} from '@mui/material';

type CustomMultiCheckboxProps = {
	label: string;
	name: string;
	options: { label: string; value: string }[];
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	fullWidth?: boolean;
	props?: TextFieldProps;
};

export const CustomMultiCheckbox: React.FC<CustomMultiCheckboxProps> = ({
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

	const handleChange = (field: any, value: string) => {
		const currentIndex = field.value.indexOf(value);
		const newValues = [...field.value];

		if (currentIndex === -1) {
			newValues.push(value);
		} else {
			newValues.splice(currentIndex, 1);
		}
		field.onChange(newValues);
	};

	return (
		<FormControl component='fieldset' required={required} error={hasError} fullWidth={fullWidth} {...props}>
			<FormLabel sx={{ marginBottom: '0.5rem', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
				{label}
			</FormLabel>
			<Controller
				name={name}
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<FormGroup>
						{options.map((option) => (
							<FormControlLabel
								key={option.value}
								control={
									<Checkbox
										checked={field.value.includes(option.value)}
										onChange={readOnly ? undefined : () => handleChange(field, option.value)}
										onBlur={field.onBlur}
										onClick={readOnly ? (e) => e.preventDefault() : undefined}
										disabled={disabled}
									/>
								}
								label={option.label}
							/>
						))}
					</FormGroup>
				)}
			/>
			{hasError && <FormHelperText>{formState.errors[name]?.message as string}</FormHelperText>}
		</FormControl>
	);
};
