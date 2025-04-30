
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
    
    // Check for problematic routes
    if (location.pathname.includes('/undefined') || 
        location.pathname.includes('/null') ||
        location.pathname.endsWith('/preview') ||
        location.pathname.endsWith('/edit')) {
      console.error('WARNING: Potentially invalid route detected:', location.pathname);
    }
  }, [location]);
  
  return null; // This component doesn't render anything
};

export default RouteLogger;