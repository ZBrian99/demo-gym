import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Iconos para los checkboxes
const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

// Definimos un tipo base que requiere `id` y una propiedad para mostrar el label
interface BaseItem {
	id: string;
}

interface CustomAutocompleteProps<T extends BaseItem> {
	items: T[]; // Las opciones pueden ser de cualquier tipo que extienda BaseItem
	multiple?: boolean; // Indica si es de selección múltiple o única
	label?: string; // Etiqueta del input
	placeholder?: string; // Placeholder del input
	loading?: boolean; // Indicador de carga
	getOptionLabel: (item: T) => string; // Función para extraer el label de cada opción
	onChange: (value: T | T[] | null) => void; // Función que se ejecuta cuando cambia la selección
	value: T | T[] | null; // Valor seleccionado
	fetchData: () => void; // Función para cargar datos cuando el Autocomplete se abre
	disabled?: boolean; // Deshabilita el Autocomplete
}

// Componente reutilizable CustomAutocomplete con genéricos
const CustomAutocomplete = <T extends BaseItem>({
	items,
	multiple = false,
	label = 'Selecciona una opción',
	placeholder = 'Escribe para buscar',
	loading = false,
	getOptionLabel,
	onChange,
	value,
	fetchData,
	disabled = false,
}: CustomAutocompleteProps<T>) => {
	const [open, setOpen] = useState(false); // Controla la apertura del Autocomplete

	const handleOpen = () => {
		setOpen(true);
		fetchData(); // Cargar datos solo cuando se abre el Autocomplete
	};

	return (
		<Autocomplete
			disabled={disabled}
			multiple={multiple} // Activa la selección múltiple si es necesario
			disableCloseOnSelect={multiple} // Evita que se cierre al seleccionar una opción en modo múltiple
			open={open}
			onOpen={handleOpen} // Llama a fetchData cuando se abre
			onClose={() => setOpen(false)} // Cierra el Autocomplete
			options={items}
			getOptionLabel={getOptionLabel} // Usa la función proporcionada para mostrar el label
			isOptionEqualToValue={(option, value) => option.id === value.id} // Compara IDs
			loading={loading}
			value={value}
			onChange={(event, newValue) => onChange(newValue)}
			renderOption={(props, option, { selected }) => (
				<li {...props} key={option.id}>
					{multiple && <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />}
					{getOptionLabel(option)}
				</li>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					placeholder={placeholder}
					slotProps={{
						input: {
							...params.InputProps,
							endAdornment: (
								<>
									{loading ? <CircularProgress color='inherit' size={20} /> : null}
									{params.InputProps?.endAdornment}
								</>
							),
						},
					}}
				/>
			)}
			noOptionsText={loading ? 'Cargando...' : 'No hay opciones'}
		/>
	);
};

export default CustomAutocomplete;
