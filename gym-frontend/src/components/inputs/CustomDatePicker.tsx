import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, DateView } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { TextField, FormControl, FormHelperText, FormLabel, TextFieldProps } from '@mui/material';

type CustomDatePickerProps = {
	label: string;
	name: string;
	format?: string;
	dependentFields?: string[];
	minDate?: string | Dayjs;
	maxDate?: string | Dayjs;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	fullWidth?: boolean;
	sx?: TextFieldProps['sx'];
	shrink?: boolean;
	views?: DateView[];
};

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
	label,
	name,
	format = 'DD/MM/YYYY',
	dependentFields = [],
	minDate,
	maxDate,
	required = false,
	disabled = false,
	readOnly = false,
	fullWidth = false,
	sx,
	shrink = true,
	views = ['day', 'month', 'year'],
}) => {
	const { control, formState, trigger, getValues } = useFormContext();
	const hasError = !!formState.errors[name];

	const handleBlur = () => {
		trigger(name);
		// console.log('trigger', name);
		dependentFields.forEach((depName) => {
			if (getValues(depName)) {
				trigger(depName);
			}
		});
	};

	return (
		<FormControl fullWidth={fullWidth} required={required} error={hasError} sx={sx}>
			{!shrink && (
				<FormLabel sx={{ marginBottom: '0.5rem', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
					{label}
				</FormLabel>
			)}
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<DatePicker
						disabled={disabled}
						views={views}
						readOnly={readOnly}
						label={shrink ? label : undefined}
						value={field.value ? dayjs(field.value) : null}
						onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
						minDate={minDate ? dayjs(minDate) : undefined}
						maxDate={maxDate ? dayjs(maxDate) : undefined}
						format={format}
						onClose={handleBlur}
						slotProps={{
							field: { clearable: true },
							openPickerButton: {
								size: 'small',
								sx: {
									marginRight: '-0.45rem',
								},
							},
							openPickerIcon: {
								fontSize: 'small',
							},
							textField: {
								required,
								fullWidth,
								sx,
								error: hasError,
								helperText: hasError ? (formState.errors[name]?.message as string) : undefined,
								size: 'small',
								autoComplete: 'off',
								inputProps: { onBlur: handleBlur },
							},
						}}
					/>
				)}
			/>
		</FormControl>
	);
};
