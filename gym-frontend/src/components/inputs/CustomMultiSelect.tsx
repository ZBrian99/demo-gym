import { useFormContext, Controller } from 'react-hook-form';
import {
	Autocomplete,
	TextField,
	Checkbox,
	FormControl,
	FormHelperText,
	FormLabel,
	TextFieldProps,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

type Option = {
	label: string;
	value: string;
};

type CustomMultiSelectProps = {
	label: string;
	name: string;
	options: Option[];
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	shrink?: boolean;
	fullWidth?: boolean;
	sx?: TextFieldProps['sx'];
};

const icon = <CheckBoxOutlineBlankIcon />;
const checkedIcon = <CheckBoxIcon />;

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
	label,
	name,
	options,
	required = false,
	disabled = false,
	readOnly = false,
	shrink = true,
	fullWidth = false,
	sx,
}) => {
	const { control, formState } = useFormContext();

	return (
		<FormControl required={required} error={!!formState.errors[name]} fullWidth={fullWidth} sx={sx}>
			{!shrink && (
				<FormLabel sx={{ marginBottom: '0.5rem', color: 'inherit', fontWeight: 'inherit', fontSize: 'inherit' }}>
					{label}
				</FormLabel>
			)}
			<Controller
				name={name}
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<Autocomplete
						multiple
						size='small'
						options={options}
						disableCloseOnSelect
						disabled={disabled}
						readOnly={readOnly}
						value={options.filter((option) => field.value.includes(option.value))}
						defaultValue={[]}
						getOptionLabel={(option) => option.label}
						onChange={(_, values) => field.onChange(values.map((val) => val.value))}
						renderOption={(props, option, { selected }) => (
							<li {...props} key={option.value} style={{ padding: '4px 8px' }}>
								<Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
								{option.label}
							</li>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								label={shrink ? label : undefined}
								variant='outlined'
								defaultValue={[]}
								error={!!formState.errors[name]}
								helperText={formState.errors[name]?.message?.toString()}
							/>
						)}
					/>
				)}
			/>
		</FormControl>
	);
};
