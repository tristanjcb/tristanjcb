import { NextResponse, type NextRequest } from 'next/server';
import { preferredLocale } from './lib/i18n';
export function proxy(request: NextRequest) {
  const locale = preferredLocale(
    request.cookies.get('aurora-locale')?.value,
    request.headers.get('accept-language') ?? '',
  );
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}
export const config = { matcher: ['/'] };
