import { Helmet } from 'react-helmet-async';

const APP = import.meta.env.VITE_APP_NAME || 'gyan.it';
const URL = import.meta.env.VITE_APP_URL || 'https://gyan.it';

export default function SEOHead({ title, description, path = '' }) {
  const fullTitle = title ? `${title} — ${APP}` : `${APP} — Learn, Attempt, Earn`;
  const desc = description || 'India\'s free platform for structured online learning. Watch lectures, attempt quizzes, earn verified certificates.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={`${URL}${path}`} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${URL}${path}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
