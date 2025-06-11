import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, FormGroup } from '@mui/material';

type CustomCheckboxProps = {
	label: string;
	name: string;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
};

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
	label,
	name,
	required = false,
	disabled = false,
	readOnly = false,
}) => {
	const { control, formState } = useFormContext();

	return (
		<FormControl required={required} error={!!formState.errors[name]} component='fieldset'>
			<FormGroup>
				<Controller
					name={name}
					control={control}
					render={({ field }) => (
						<FormControlLabel
							control={
								<Checkbox
									{...field}
									checked={!!field.value}
									onClick={readOnly ? (e) => e.preventDefault() : undefined}
									disabled={disabled}
								/>
							}
							label={label}
						/>
					)}
				/>
			</FormGroup>
			{formState.errors[name] && <FormHelperText error>{formState.errors[name]?.message as string}</FormHelperText>}
		</FormControl>
	);
};
