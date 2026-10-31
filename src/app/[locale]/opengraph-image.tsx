import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Tristan · Code, Sound, Stories';
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: '#0a0c14',
        color: '#f8f9fd',
        padding: 80,
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#9188f8' }}
      >
        <span>TRISTAN / CODE · SOUND · STORIES</span>
        <span>CODE · SOUND · STORIES</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 100, letterSpacing: -5 }}>
        <span>Three worlds.</span>
        <span style={{ color: '#9188f8' }}>One origin.</span>
      </div>
      <div style={{ display: 'flex', fontSize: 22, color: '#a0a5b9' }}>
        {locale === 'fr' ? 'Développement / Musique / Création' : 'Development / Music / Creation'}{' '}
        — tristan.kresov.com
      </div>
    </div>,
    size,
  );
}
