import { Icon } from '@/components/icons/Icon';
import Link from 'next/link';
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          padding: '12vh 8vw',
          fontFamily: 'system-ui',
          background: '#0a0c14',
          color: '#f8f9fd',
          minHeight: '100vh',
        }}
      >
        <p>404 / TRISTAN</p>
        <h1>
          Cette page n’existe pas.
          <br />
          This page does not exist.
        </h1>
        <p>
          <Link style={{ color: '#9188f8' }} href="/fr">
            Accueil FR <Icon name="chevron-right" />
          </Link>{' '}
          ·{' '}
          <Link style={{ color: '#74ddea' }} href="/en">
            Home EN <Icon name="chevron-right" />
          </Link>
        </p>
      </body>
    </html>
  );
}
