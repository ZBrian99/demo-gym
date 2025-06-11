import { Box, Paper, Typography } from '@mui/material';
import { AccessResponse as AccessResponseType, AccessStatus, Modality } from '../../types/access.types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

dayjs.locale('es');

type StatusColor = 'success' | 'error' | 'warning' | 'info';

interface StatusConfig {
	color: StatusColor;
	icon: typeof CheckCircleOutlineIcon;
	title: string;
}

interface AccessResponseProps {
	response: AccessResponseType;
	onClose: () => void;
}

const getModalityText = (modality: Modality): string => {
	const modalityMap = {
		[Modality.FREE]: 'Libre 🔥',
		[Modality.THREE]: '3 veces por semana ⚖️',
		[Modality.TWO]: '2 veces por semana 🌱',
	};
	return modalityMap[modality] || 'No definida ❓';
};

const statusConfigMap: Record<string, StatusConfig> = {
	granted: {
		color: 'success',
		icon: CheckCircleOutlineIcon,
		title: '¡Bienvenido/a!',
	},
	noEnrollment: {
		color: 'info',
		icon: PersonAddIcon,
		title: 'Usuario No Registrado',
	},
	inscripcionNoActiva: {
		color: 'info',
		icon: ErrorOutlineIcon,
		title: 'Inscripción No Activa',
	},
	accesoBloqueado: {
		color: 'error',
		icon: BlockIcon,
		title: 'Acceso Suspendido',
	},
	sinAccesos: {
		color: 'warning',
		icon: AccessTimeIcon,
		title: 'Sin Accesos Disponibles',
	},
	default: {
		color: 'error',
		icon: ErrorOutlineIcon,
		title: 'Error',
	},
};

const getStatusConfig = (response: AccessResponseType): StatusConfig => {
	const { status, enrollment, deniedReason } = response;
	
	// Caso especial para admin
	if (enrollment?.user.id === 'admin') {
		return {
			color: 'success',
			icon: CheckCircleOutlineIcon,
			title: 'Administrador'
		};
	}
	
	// Caso especial: acceso concedido pero próximo a vencer
	if (status === AccessStatus.GRANTED && enrollment?.endDate) {
		const daysToExpire = dayjs(enrollment.endDate).diff(dayjs(), 'days');
		if (daysToExpire <= 7) {
			return {
				color: 'warning',
				icon: AccessTimeIcon,
				title: '¡Bienvenido/a!'
			};
		}
		return statusConfigMap.granted;
	}

	// Resto de casos
	if (!enrollment) return statusConfigMap.noEnrollment;
	if (deniedReason?.includes('inscripción activa')) return statusConfigMap.inscripcionNoActiva;
	if (deniedReason?.includes('no activo')) return statusConfigMap.accesoBloqueado;
	if (deniedReason?.includes('accesos')) return statusConfigMap.sinAccesos;
	return statusConfigMap.default;
};

// Mantener interfaces y tipos fuera
interface ErrorMessage {
	title: string;
	message: string;
	icon: string;
	details: string;
}

type ErrorMessages = Record<string, ErrorMessage>;

// Mantener mapas y funciones estáticas fuera
const errorMessages: ErrorMessages = {
	'inscripción activa': {
		title: 'Inscripción No Activa',
		message: 'Necesitamos activar tu inscripción',
		icon: '🔄',
		details: 'Consulta con nuestro equipo para activarla',
	},
	período: {
		title: 'Inscripción Vencida',
		message: 'Tu inscripción ha vencido',
		icon: '⌛',
		details: 'Consulta con nuestro equipo para renovarla',
	},
	'no activo': {
		title: 'Acceso Suspendido',
		message: 'Tu acceso está temporalmente suspendido',
		icon: '⛔',
		details: 'Consulta con nuestro equipo para más información',
	},
	accesos: {
		title: 'Sin Accesos Disponibles',
		message: 'Has alcanzado el límite de accesos semanales',
		icon: '⌛',
		details: 'Próxima renovación: {nextMonday}',
	},
	vencida: {
		title: 'Inscripción Vencida',
		message: 'Tu inscripción ha vencido',
		icon: '⏰',
		details: 'Consulta con nuestro equipo para renovarla',
	},
};

export const AccessResponse = ({ response, onClose }: AccessResponseProps) => {
	const theme = useTheme();
	const statusConfig = getStatusConfig(response);
	const StatusIcon = statusConfig.icon;

	// Mover errorContent dentro del componente
	const errorContent = (title: string, message: string, icon?: string, details?: string) => (
		<Box sx={{ textAlign: 'center' }}>
			<Typography
				variant='h3'
				sx={{
					mb: {
						xs: 0.5,
						md: 1,
					},
					// color: statusConfig.color,

					fontWeight: 'bold',
					fontSize: {
						xs: '2rem',
						md: '3rem',
					},
					color: 'primary.main',
				}}
			>
				{title}
			</Typography>
			<Typography
				sx={{
					fontSize: {
						xs: '1.6rem',
						md: '2.2rem',
					},
					mb: {
						xs: 0.5,
						md: 1,
					},
					color: 'text.primary',
					maxWidth: '90%',
					mx: 'auto',
					lineHeight: 1.3,
					fontWeight: 'bold',
				}}
			>
				{message} {icon}
			</Typography>
			{details && (
				<Box
					sx={{
						mt: {
							xs: 1.5,
							md: 2,
						},
						p: {
							xs: 1.5,
							md: 2,
						},
						bgcolor: 'background.default',
						borderRadius: 2,
						border: '2px solid',
						borderColor: 'divider',
					}}
				>
					<Typography
						sx={{
							fontSize: {
								xs: '1.4rem',
								md: '1.8rem',
							},
							color: 'text.primary',
							maxWidth: '90%',
							mx: 'auto',
							fontWeight: 500,
						}}
					>
						{details}
					</Typography>
				</Box>
			)}
		</Box>
	);

	useEffect(() => {
		const cleanup = () => {
			window.removeEventListener('keydown', onClose);
			clearTimeout(timer);
		};
		
		const timer = setTimeout(onClose, 10000);
		window.addEventListener('keydown', onClose);
		
		return cleanup;
	}, [onClose]);

	const getNextMonday = () => {
		const today = dayjs();
		const nextMonday = today.startOf('week').add(1, 'week');
		return nextMonday.format('dddd D [de] MMMM');
	};

	const renderContent = () => {
		const { status, enrollment, deniedReason } = response;

		// Caso especial para admin
		if (enrollment?.user.id === 'admin') {
			return (
				<Box sx={{ textAlign: 'center' }}>
					<Typography variant='h3' sx={{ 
						mb: 1.5, 
						fontSize: {
							xs: '2rem',
							md: '3rem'
						}, 
						fontWeight: 'bold',
						color: 'primary.main'
					}}>
						¡Administrador! 🔑
					</Typography>
					<Typography sx={{ 
						fontSize: {
							xs: '1.6rem',
							md: '2rem'
						},
						color: 'text.primary'
					}}>
						Acceso concedido 🔓
					</Typography>
				</Box>
			);
		}

		if (status === AccessStatus.GRANTED && enrollment) {
			const { user, modality, weeklyAccesses, endDate } = enrollment;
			const daysToExpire = endDate 
				? dayjs(endDate).startOf('day').diff(dayjs().startOf('day'), 'day')
				: null;
			const formattedEndDate = endDate ? dayjs(endDate).format('DD [de] MMMM') : null;
			const isBirthday = user.birthDate ? dayjs(user.birthDate).format('MM-DD') === dayjs().format('MM-DD') : false;

			return (
				<Box sx={{ textAlign: 'center' }}>
					<Typography
						variant='h3'
						sx={{
							mb: {
								xs: 0.5,
								md: 1,
							},
							fontSize: {
								xs: '2rem',
								md: '3rem',
							},
							fontWeight: 'bold',
							color: 'primary.main',
							}}
					>
						{isBirthday
							? '¡Feliz Cumpleaños! 🎉🎂'
							: user.gender
							? `¡Bienvenid${user.gender === 'F' ? 'a' : 'o'}! 💪`
							: '¡Bienvenido/a! 💪'}
					</Typography>

					<Typography
						sx={{
							mb: {
								xs: 0.5,
								md: 1,
							},
							fontSize: {
								xs: '1.6rem',
								md: '2.2rem',
							},
							fontWeight: 'bold',
							color: 'text.primary',
						}}
					>
						{user.name} {user.lastName} ⭐
					</Typography>

					<Box
						sx={{
							mt: {
								xs: 1.5,
								md: 2,
							},
							p: {
								xs: 1.5,
								md: 2,
							},
							bgcolor: 'background.default',
							borderRadius: 2,
              border: '2px solid',
							borderColor: 'divider',
						}}
					>
						{modality && (
							<Typography
								sx={{
									mb: {
										xs: 0.5,
										md: 1,
									},
									fontSize: {
										xs: '1.6rem',
										md: '2rem',
									},
									fontWeight: 'bold',
									color: 'primary.main',
								}}
							>
								Modalidad: {getModalityText(modality)}
							</Typography>
						)}

						{modality !== Modality.FREE && (
							<Typography
								sx={{
									mb: {
										xs: 0.5,
										md: 1,
									},
									fontSize: {
										xs: '1.2rem',
										md: '1.8rem',
									},
									fontWeight: 'bold',
									color: 'text.primary',
									}}
							>
								Accesos restantes: {modality === Modality.THREE ? 3 - weeklyAccesses : 2 - weeklyAccesses} 🔄
							</Typography>
							)}

						{endDate && (
							<Typography
								sx={{
									fontSize: {
										xs: '1.2rem',
										md: '1.8rem',
									},
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 1,
									color:
										daysToExpire === 0
											? 'error.main'
											: daysToExpire && daysToExpire <= 3
											? 'error.main'
											: daysToExpire && daysToExpire <= 7
											? 'warning.main'
											: 'text.primary',
									fontWeight: daysToExpire === 0 || daysToExpire && daysToExpire <= 7 ? 'bold' : '500',
								}}
							>
								{daysToExpire === 0 ? (
									<>Tu inscripción vence hoy ⏰</>
								) : (
									<>
										Tu inscripción vence {daysToExpire === 1 ? 'mañana' : `en ${daysToExpire} días`},
										el {formattedEndDate} ⏳
									</>
								)}
							</Typography>
						)}
					</Box>
				</Box>
			);
		}

		// Caso de usuario no encontrado
		if (!enrollment) {
			return errorContent(
				'No Registrado',
				'No encontramos tu DNI',
				'🔍',
				'Consulta con nuestro equipo para registrarte'
			);
		}

		// Resto de casos de error
		const errorKey = Object.keys(errorMessages).find(key => deniedReason?.includes(key));
		if (errorKey && errorMessages[errorKey]) {
			const { title, message, icon, details } = errorMessages[errorKey];
			return errorContent(
				title,
				message,
				icon,
				details.includes('{nextMonday}') ? details.replace('{nextMonday}', getNextMonday()) : details
			);
		}

		return null;
	};

	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				bgcolor: 'rgba(0, 0, 0, 0.7)',
				zIndex: 1000,
        padding: 2,
			}}
			onClick={onClose}
		>
			<Paper
				elevation={2}
				onClick={(e) => e.stopPropagation()}
				sx={{
					p: {
						xs: 2.5,
						md: 3.5
					},
					width: {
						xs: '100%',
						sm: '45rem',
						md: '60rem'
					},
					maxWidth: '100%',
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
					borderRadius: {
						xs: 3,
						md: 6
					},
					borderTop: (theme) => `6px solid ${theme.palette[statusConfig.color].main}`,
					bgcolor: 'background.paper',
					minHeight: {
						xs: '18rem',
            md: '22rem',
					}
				}}
			>
				<StatusIcon
					sx={{
						fontSize: {
							xs: '2rem',
							md: '3rem'
						},
						mb: {
							xs: 1,
							md: 1.5
						},
						mt: 0.5,
						alignSelf: 'center',
						color: `${statusConfig.color}.main`,
					}}
				/>
				{renderContent()}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.5,
						mt: 'auto',
						pt: {
							xs: 2,
							md: 3
						},
						color: 'text.secondary',
					}}
				>
					<KeyboardReturnIcon sx={{ 
						fontSize: {
							xs: '1rem',
							md: '1.4rem'
						}
					}} />
					<Typography sx={{ 
						fontSize: {
							xs: '0.9rem',
							md: '1.2rem'
						}, 
						fontWeight: 500 
					}}>
						Presione cualquier tecla para continuar
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
};
