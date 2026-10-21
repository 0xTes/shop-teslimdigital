import Maintenance from './pages/Maintenance';
import Storefront from './Storefront';

export default function App() {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  return isMaintenanceMode ? <Maintenance /> : <Storefront />;
}
