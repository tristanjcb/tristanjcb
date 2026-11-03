import type { CSSProperties } from 'react';
import { codeToTokens } from 'shiki';
import { narrativeCode } from '@/content/cinematic';
import styles from './NarrativeCode.module.scss';

// Highlight on the server: no grammar, WASM or highlighter bundle in the browser.
export async function NarrativeCode() {
  const { tokens } = await codeToTokens(narrativeCode.join('\n'), {
    lang: 'typescript',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
  return (
    <pre className={styles.code}>
      <code>
        {tokens.map((line, index) => (
          <span key={index}>
            <i aria-hidden="true">{index + 1}</i>
            {line.map((token, position) => (
              <span
                key={position}
                className={styles.token}
                style={token.htmlStyle as CSSProperties}
              >
                {token.content}
              </span>
            ))}
            {'\n'}
          </span>
        ))}
      </code>
    </pre>
  );
}
