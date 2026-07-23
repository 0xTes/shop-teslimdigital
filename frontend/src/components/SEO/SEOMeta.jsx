import { Helmet } from 'react-helmet-async';

const siteUrl = import.meta.env.VITE_APP_URL || 'https://shop.teslim.digital';

export default function SEOMeta({ title, description, image, url, noIndex = false }) {
  const canonicalUrl = url || siteUrl;
  const fullTitle = title ? `${title} | Teslim Digital Shop` : 'Teslim Digital Shop';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
