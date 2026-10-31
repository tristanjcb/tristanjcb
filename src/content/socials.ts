import type { IconName } from '@/components/icons/Icon';
export const email = 'tristan@kresov.com';
export interface SocialLink {
  label: string;
  href: string;
  icon: IconName;
  placeholder?: boolean;
}
export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/tristanjcb', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/tristanjacob21', icon: 'linkedin' },
  { label: 'Email', href: `mailto:${email}`, icon: 'mail' },
  { label: 'Buy Me a Coffee', href: 'https://buymeacoffee.com/tristanjcb', icon: 'buymeacoffee' },
  { label: 'X', href: 'https://www.x.com/Tristan__Jcb', icon: 'x' },
  { label: 'Instagram', href: 'https://instagram.com/tristanjcb', icon: 'instagram' },
  { label: 'Pinterest', href: 'https://pin.it/3dX6XAOtK', icon: 'pinterest' },
  { label: 'TikTok', href: 'https://www.tiktok.com/', icon: 'tiktok', placeholder: true },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube', placeholder: true },
  { label: 'Discord', href: 'https://discord.com/users/705425854825496656', icon: 'discord' },
];
