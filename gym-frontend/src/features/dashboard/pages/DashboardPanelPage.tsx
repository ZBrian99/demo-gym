import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const DashboardPanelPage = () => {
  const { panel } = useParams();
  
  return (
    <Typography variant="h4">
      Panel del Dashboard: {panel}
    </Typography>
  );
};

export default DashboardPanelPage; 