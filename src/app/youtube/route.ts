import { socials } from '@/content/socials';
export function GET() {
  const profile = socials.find((social) => social.icon === 'youtube')!.href;
  const configured = process.env.YOUTUBE_URL ?? profile;
  try {
    const url = new URL(configured);
    if (
      url.protocol === 'https:' &&
      ['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)
    )
      return Response.redirect(url, 307);
  } catch {
    /* Use the confirmed profile if the environment override is invalid. */
  }
  return Response.redirect(profile, 307);
}
