import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import Layout from '../layouts/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoadingScreen from '../components/common/LoadingScreen';
import { Stack } from '@mui/material';
// import LoginPage from '../features/auth/pages/LoginPage';
// import HomePage from '../features/dashboard/pages/HomePage';
// import UsersPage from '../features/users/pages/UsersPage';
// import AccessPage from '../features/access/pages/AccessPage';
// import UserDetailsPage from '../features/users/pages/UserDetailsPage';
// import AccessDetailsPage from '../features/access/pages/AccessDetailsPage';
// // // import DashboardPanelPage from '../features/dashboard/pages/DashboardPanelPage';

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
// const HomePage = lazy(() => import('../features/dashboard/pages/HomePage'));
// const DashboardPanelPage = lazy(() => import('../features/dashboard/pages/DashboardPanelPage'));
const UsersPage = lazy(() => import('../features/users/pages/UsersPage'));
const UserDetailsPage = lazy(() => import('../features/users/pages/UserDetailsPage'));
const AccessPage = lazy(() => import('../features/access/pages/AccessPage'));
const AccessDetailsPage = lazy(() => import('../features/access/pages/AccessDetailsPage'));

const AppRoutes = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
		<Suspense
			fallback={
				<Stack direction='column' justifyContent='center' alignItems='center' minHeight='100vh'>
					<LoadingScreen />
				</Stack>
			}
		>
			<Routes>
				{/* Rutas públicas */}
				<Route path='/login' element={isAuthenticated ? <Navigate to='/users' replace /> : <LoginPage />} />

				{/* Rutas protegidas */}
				<Route
					element={
						<ProtectedRoute>
							<Layout />
						</ProtectedRoute>
					}
				>
					{/* Rutas principales */}
					<Route path='/users' element={<UsersPage />} />
					<Route path='/access' element={<AccessPage />} />
					{/* <Route path='/dashboard' element={<HomePage />} /> */}

					{/* Subrutas */}
					<Route path='/users/:id' element={<UserDetailsPage />} />
					<Route path='/access/:id' element={<AccessDetailsPage />} />
					{/* <Route path='/dashboard/:panel' element={<DashboardPanelPage />} /> */}
				</Route>

				{/* Redirige cualquier ruta no encontrada */}
				<Route path='*' element={<Navigate to={isAuthenticated ? '/users' : '/login'} replace />} />
			</Routes>
		</Suspense>
	);
};

export default AppRoutes; 