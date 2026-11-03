import { z } from 'zod';
export const articleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  locale: z.enum(['fr', 'en']),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
    }, 'Invalid calendar date'),
  published: z.boolean().default(false),
  tags: z.array(z.string().min(1)).default([]),
});
export function readingMinutes(source: string) {
  return Math.max(
    1,
    Math.ceil(
      source
        .replace(/```[\s\S]*?```/g, '')
        .split(/\s+/)
        .filter(Boolean).length / 200,
    ),
  );
}
export function xmlEscape(value: string) {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!,
  );
}
export function headingId(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
