'use client';
import { ThemeProvider as Provider } from 'next-themes';
// Migrate the former system preference before next-themes reads storage.
const migrateTheme = `try{var t=localStorage.getItem('aurora-theme');if(t&&t!=='light'&&t!=='dark')localStorage.setItem('aurora-theme','dark')}catch{}`;
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: migrateTheme }} />
      <Provider
        attribute="data-theme"
        defaultTheme="dark"
        enableSystem={false}
        themes={['dark', 'light']}
        storageKey="aurora-theme"
      >
        {children}
      </Provider>
    </>
  );
}
