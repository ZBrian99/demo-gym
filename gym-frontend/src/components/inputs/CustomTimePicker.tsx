import { Controller, useFormContext, Control } from 'react-hook-form';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { TextFieldProps } from '@mui/material';

type CustomTimePickerProps = {
	label: string;
	name: string;
	control?: Control<any>;
	format?: string;
	dependentFields?: string[];
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	fullWidth?: boolean;
	sx?: TextFieldProps['sx'];
};

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
	label,
	name,
	control,
	format = 'HH:mm',
	dependentFields = [],
	required = false,
	disabled = false,
	readOnly = false,
	fullWidth = false,
	sx,
}) => {
	const formContext = useFormContext();
	const effectiveControl = control || formContext?.control;

	if (!effectiveControl) {
		console.error('CustomTimePicker requires a control prop or must be used within a FormProvider');
		return null;
	}

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
			control={effectiveControl}
			render={({ field, fieldState }) => (
				<TimePicker
					// ampm={false}
					disabled={disabled}
					readOnly={readOnly}
					label={label}
					value={field.value ? dayjs(`2021-01-01T${field.value}`) : null}
					onChange={(time) => {
						field.onChange(time ? time.format('HH:mm') : '');
					}}
					format={format}
					onClose={() => {
						handleBlur();
					}}
					slotProps={{
						textField: {
							required,
							error: !!fieldState.error,
							helperText: fieldState.error?.message,
							size: 'small',
							autoComplete: 'off',
							inputProps: {
								onBlur: handleBlur,
							},
						},
					}}
				/>
			)}
		/>
	);
};
