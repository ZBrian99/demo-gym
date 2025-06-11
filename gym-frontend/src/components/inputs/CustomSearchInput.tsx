import { ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Search from '@mui/icons-material/Search';
import Clear from '@mui/icons-material/Clear';

type CustomSearchInputProps = {
	label: string;
	name: string;
	icon?: ReactNode;
	onClick?: () => void;
	onClear?: () => void;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	fullWidth?: boolean;
	sx?: TextFieldProps['sx'];
	placeholder?: string;
};

export const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
	label,
	name,
	icon = <Search fontSize='small' />,
	onClick = () => {},
	onClear,
	required = false,
	disabled = false,
	readOnly = false,
	fullWidth = false,
	sx,
	placeholder,
}) => {
	const { register, formState, setValue } = useFormContext();
	const fieldValue = useWatch({ name });

	const handleClear = () => {
		setValue(name, '');
		if (onClear) {
			onClear();
		} else {
			onClick();
		}
	};

	return (
		<TextField
			{...register(name)}
			label={label}
			placeholder={placeholder}
			type='text'
			fullWidth={fullWidth}
			
			required={required}
			disabled={disabled}
			error={!!formState.errors?.[name]}
			helperText={formState.errors?.[name]?.message as string | undefined}
			size='small'
			autoComplete='off'
			sx={sx}
			slotProps={{
				input: {
					readOnly,
					endAdornment: (
						<InputAdornment position='end' sx={{ marginRight: '-12px' }}>
							{fieldValue && (
								<IconButton size='small' onClick={handleClear} aria-label='clear action'>
									<Clear fontSize='small' />
								</IconButton>
							)}
							<IconButton
								size='small'
								onClick={onClick}
								aria-label='search action'
								sx={{
									marginRight: 0.6,
								}}
							>
								{icon}
							</IconButton>
						</InputAdornment>
					),
				},
			}}
		/>
	);
};
