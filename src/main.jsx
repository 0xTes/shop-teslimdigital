import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

useEffect(() => {
  // Initialize GA4
  window.gtag('config', 'GA_MEASUREMENT_ID', {
    page_path: location.pathname
  });
}, [location]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)

