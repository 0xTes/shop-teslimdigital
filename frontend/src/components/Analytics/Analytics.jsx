import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let gaScriptLoaded = false;

function loadGaScript() {
  if (gaScriptLoaded || !GA_MEASUREMENT_ID) return;
  gaScriptLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
}

export default function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    loadGaScript();

    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname
      });
    }
  }, [location]);

  return null;
}
