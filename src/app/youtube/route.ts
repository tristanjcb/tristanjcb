import { socials } from '@/content/socials';
export function GET() {
  const configured =
    process.env.YOUTUBE_URL ?? socials.find((social) => social.icon === 'youtube')!.href;
  try {
    const url = new URL(configured);
    if (
      url.protocol === 'https:' &&
      ['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)
    )
      return Response.redirect(url, 307);
  } catch {
    /* Keep the user-approved platform placeholder for invalid configuration. */
  }
  return Response.redirect('https://www.youtube.com/', 307);
}
