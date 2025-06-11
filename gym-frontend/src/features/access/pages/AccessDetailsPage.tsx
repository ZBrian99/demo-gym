import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const AccessDetailsPage = () => {
  const { id } = useParams();
  
  return (
    <Typography variant="h4">
      Detalles del Acceso {id}
    </Typography>
  );
};

export default AccessDetailsPage; 