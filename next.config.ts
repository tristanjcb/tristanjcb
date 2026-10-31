import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  async redirects() {
    return [
      ...Object.entries({
        about: 'me',
        projects: 'projects',
        contact: 'contact',
        sponsors: 'sponsors',
        partners: 'sponsors',
        music: 'projects/music',
      }).map(([source, target]) => ({
        source: `/${source}`,
        destination: `/en/${target}`,
        permanent: true,
      })),
    ];
  },
};
export default config;
