'use client';
import Link from 'next/link';
import styles from './Navigation.module.scss';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { navigation, ui, type Locale } from '@/lib/i18n';
export type SearchItem = { label: string; detail: string; href: string };
export function Navigation({
  locale,
  items,
  translatedArticles,
}: {
  locale: Locale;
  items: SearchItem[];
  translatedArticles: string[];
}) {
  const path = usePathname();
  const { setTheme } = useTheme();
  const menuRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLDialogElement>(null);
  const resultList = useRef<HTMLUListElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState('');
  const [theme, setSelectedTheme] = useState('system');
  const open = (kind: 'menu' | 'search') => {
    const dialog = kind === 'menu' ? menuRef.current : searchRef.current;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    if (kind === 'search') {
      setQuery('');
      searchInput.current?.focus();
    }
  };
  const close = () => {
    menuRef.current?.close();
    searchRef.current?.close();
    document.body.style.overflow = '';
  };
  useEffect(() => {
    const stored = localStorage.getItem('aurora-theme');
    if (stored && ['system', 'light', 'dark'].includes(stored)) {
      // Synchronize a preference owned by browser storage after hydration.
      // oxlint-disable-next-line react/set-state-in-effect
      setSelectedTheme(stored);
    }
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (searchRef.current?.open) close();
        else {
          menuRef.current?.close();
          open('search');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, []);
  const otherLocale = locale === 'fr' ? 'en' : 'fr';
  const slug = path.match(/^\/(?:fr|en)\/blog\/([^/]+)$/)?.[1];
  const translatedPath =
    slug && !translatedArticles.includes(slug)
      ? `/${otherLocale}/blog`
      : path.replace(/^\/(fr|en)(?=\/|$)/, `/${otherLocale}`);
  const results = items.filter((item) =>
    `${item.label} ${item.detail}`
      .toLocaleLowerCase(locale)
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .includes(
        query
          .toLocaleLowerCase(locale)
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, ''),
      ),
  );
  const controls = (
    <div className="preferences">
      <Link
        href={translatedPath}
        hrefLang={otherLocale}
        onClick={() => {
          document.cookie = `aurora-locale=${otherLocale};path=/;max-age=31536000;SameSite=Lax`;
          close();
        }}
      >
        {otherLocale.toUpperCase()} <span aria-hidden="true">↗</span>
      </Link>
      <label>
        {ui.theme[locale]}
        <select
          aria-label={ui.theme[locale]}
          value={theme}
          onChange={(event) => {
            setTheme(event.target.value);
            setSelectedTheme(event.target.value);
          }}
        >
          {(['system', 'light', 'dark'] as const).map((value) => (
            <option key={value} value={value}>
              {ui[value][locale]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
  return (
    <>
      <header className={styles.header}>
        <Link href={`/${locale}`} className="wordmark" aria-label="Aurora — Tristan">
          a<span>urora</span>
        </Link>
        <nav
          aria-label={locale === 'fr' ? 'Navigation principale' : 'Main navigation'}
          className="desktop-nav"
        >
          {navigation.slice(1, 4).map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.path}`}
              aria-current={path === `/${locale}${item.path}` ? 'page' : undefined}
            >
              {ui[item.key][locale]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="language"
            href={translatedPath}
            hrefLang={otherLocale}
            onClick={() => {
              document.cookie = `aurora-locale=${otherLocale};path=/;max-age=31536000;SameSite=Lax`;
            }}
          >
            {otherLocale.toUpperCase()}
          </Link>
          <button
            ref={searchButton}
            onClick={() => open('search')}
            aria-label={`${ui.search[locale]} (Ctrl+K / ⌘K)`}
          >
            <span aria-hidden="true">⌕</span>
            <kbd>⌘ K</kbd>
          </button>
          <button ref={menuButton} onClick={() => open('menu')} aria-haspopup="dialog">
            {ui.menu[locale]} <span aria-hidden="true">≡</span>
          </button>
        </div>
      </header>
      <dialog
        ref={menuRef}
        className={`${styles.menu} menu-dialog`}
        aria-labelledby="menu-title"
        onClose={() => {
          document.body.style.overflow = '';
          menuButton.current?.focus();
        }}
      >
        <div className="dialog-top">
          <span id="menu-title" className="eyebrow">
            AURORA / {ui.menu[locale]}
          </span>
          <button onClick={close}>{ui.close[locale]} ×</button>
        </div>
        <div className="menu-split">
          <nav aria-label={ui.menu[locale]}>
            {navigation.map((item, index) => (
              <Link href={`/${locale}${item.path}`} key={item.key} onClick={close}>
                <small>0{index + 1}</small>
                {ui[item.key][locale]}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
          <aside>
            <p className="eyebrow">THREE WORLDS. ONE ORIGIN.</p>
            <p className="menu-manifesto">
              Code.
              <br />
              Sound.
              <br />
              Stories.
            </p>
            {controls}
            <a href="mailto:tristan@kresov.com">tristan@kresov.com ↗</a>
          </aside>
        </div>
      </dialog>
      <dialog
        ref={searchRef}
        className={`${styles.search} search-dialog`}
        aria-labelledby="search-title"
        onClose={() => {
          document.body.style.overflow = '';
          searchButton.current?.focus();
        }}
      >
        <div className="dialog-top">
          <label id="search-title" htmlFor="site-search">
            {ui.search[locale]}
          </label>
          <button onClick={close} aria-label={ui.close[locale]}>
            Esc ×
          </button>
        </div>
        <input
          ref={searchInput}
          id="site-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={ui.searchPlaceholder[locale]}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              resultList.current?.querySelector('a')?.focus();
            }
            if (event.key === 'Enter') {
              event.preventDefault();
              resultList.current?.querySelector('a')?.click();
            }
          }}
          autoComplete="off"
        />
        <output className="sr-only">
          {results.length} {locale === 'fr' ? 'résultats' : 'results'}
        </output>
        <ul className="search-results" ref={resultList}>
          {results.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={close}
                onKeyDown={(event) => {
                  const links = Array.from(resultList.current?.querySelectorAll('a') ?? []);
                  const index = links.indexOf(document.activeElement as HTMLAnchorElement);
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    links[(index + 1) % links.length]?.focus();
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    if (index <= 0) searchInput.current?.focus();
                    else links[index - 1]?.focus();
                  }
                }}
              >
                <span>
                  {item.label}
                  <small>{item.detail}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </Link>
            </li>
          ))}
        </ul>
        {!results.length && <p className="empty-inline">{ui.noResults[locale]}</p>}
      </dialog>
    </>
  );
}
