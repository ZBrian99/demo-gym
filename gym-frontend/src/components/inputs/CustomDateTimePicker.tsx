import { Controller, useFormContext, Control } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { TextFieldProps } from '@mui/material';

type CustomDateTimePickerProps = {
	label: string;
	name: string;
	control?: Control<any>;
	format?: string;
	dependentFields?: string[];
	minDate?: Dayjs | string;
	maxDate?: Dayjs | string;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	fullWidth?: boolean;
	sx?: TextFieldProps['sx'];
};

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
	label,
	name,
	control,
	format = 'DD/MM/YYYY HH:mm',
	dependentFields = [],
	minDate,
	maxDate,
	required = false,
	disabled = false,
	readOnly = false,
	fullWidth = false,
	sx,
}) => {
	const formContext = useFormContext();

	const handleBlur = () => {
		formContext.trigger(name);
		dependentFields.forEach((depName) => {
			if (formContext.getValues(depName)) {
				formContext.trigger(depName);
			}
		});
	};

	return (
		<Controller
			name={name}
			render={({ field, fieldState }) => (
				<DateTimePicker
					ampm={false}
					disabled={disabled}
					readOnly={readOnly}
					label={label}
					value={field.value ? dayjs(field.value) : null}
					onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD HH:mm') : '')}
					minDate={minDate ? dayjs(minDate) : undefined}
					maxDate={maxDate ? dayjs(maxDate) : undefined}
					format={format}
					onClose={() => handleBlur()}
					slotProps={{
						textField: {
							fullWidth,
							sx,
							required,
							error: !!fieldState.error,
							helperText: fieldState.error?.message,
							size: 'small',
							autoComplete: 'off',
							inputProps: { onBlur: handleBlur },
						},
					}}
				/>
			)}
		/>
	);
};
