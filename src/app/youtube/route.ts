export function GET() {
  const value = process.env.YOUTUBE_URL;
  if (value) {
    try {
      const url = new URL(value);
      if (
        url.protocol === 'https:' &&
        ['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)
      )
        return Response.redirect(url, 307);
    } catch {
      /* An invalid configuration must not create an unsafe redirect. */
    }
  }
  return new Response(
    'YouTube — Bientôt / Coming soon. Aucun lien officiel confirmé. No official link confirmed.',
    {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '86400',
        'X-Robots-Tag': 'noindex',
      },
    },
  );
}
