import { unstable_cache } from 'next/cache';
import { loadSupporters, type Supporter } from './api';
export type SupporterResult =
  | { status: 'ready'; supporters: Supporter[] }
  | { status: 'unavailable'; supporters: [] };
// Cache only the public projection. No financial fields or credentials reach the page.
const cached = unstable_cache(
  async (provider: 'github' | 'coffee') => {
    const token =
      provider === 'github' ? process.env.GITHUB_SPONSORS_TOKEN : process.env.BUYMEACOFFEE_TOKEN;
    if (!token) throw new Error('Provider not configured');
    return loadSupporters(provider, token);
  },
  ['public-supporters-v3'],
  { revalidate: 3600 },
);
export async function getSupporters(provider: 'github' | 'coffee'): Promise<SupporterResult> {
  if (!(provider === 'github' ? process.env.GITHUB_SPONSORS_TOKEN : process.env.BUYMEACOFFEE_TOKEN))
    return { status: 'unavailable', supporters: [] };
  try {
    return { status: 'ready', supporters: await cached(provider) };
  } catch {
    return { status: 'unavailable', supporters: [] };
  }
}
