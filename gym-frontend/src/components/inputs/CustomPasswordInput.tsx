import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type CustomPasswordInputProps = {
	label: string;
	name: string;
	showPasswordToggle?: boolean;
	dependentFields?: string[];
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	sx?: TextFieldProps['sx'];
};

export const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
	label,
	name,
	showPasswordToggle = true,
	dependentFields = [],
	required = false,
	disabled = false,
	readOnly = false,
	sx,
}) => {
	const { register, formState, trigger, getValues } = useFormContext();
	const [showPassword, setShowPassword] = useState(false);

	const handleBlur = () => {
		trigger(name);
		dependentFields.forEach((depName) => {
			if (getValues(depName)) {
				trigger(depName);
			}
		});
	};

	return (
		<TextField
			{...register(name)}
			label={label}
			type={showPassword ? 'text' : 'password'}
			required={required}
			disabled={disabled}
			error={!!formState.errors?.[name]}
			helperText={formState.errors?.[name]?.message as string | undefined}
			size='small'
			autoComplete='new-password'
			sx={sx}
			slotProps={{
				input: {
					onBlur: handleBlur,
					readOnly,
					endAdornment: showPasswordToggle && (
						<InputAdornment position='end' sx={{ marginRight: '-12px' }}>
							<IconButton onClick={() => setShowPassword(!showPassword)} aria-label='toggle password visibility'>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
				},
			}}
		/>
	);
};
