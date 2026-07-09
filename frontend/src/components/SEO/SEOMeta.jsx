import { Helmet } from 'react-helmet-async';

export default function SEOMeta({ title, description, image, url }) {
  return (
    <Helmet>
      <title>{title} | Teslim Digital Shop</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}