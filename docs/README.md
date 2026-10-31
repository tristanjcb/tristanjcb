# Aurora — guide technique

Portfolio Next.js App Router / React / TypeScript strict / SCSS Modules. Node **24.22.1** en local et en CI, pnpm **12.16.1**. Le README racine conserve sa fonction de profil GitHub.

## Démarrage

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Ouvrir http://127.0.0.1:3000/fr ou /en. Aucun secret nécessaire. `.env.example` documente l'unique option : la véritable URL YouTube, lorsqu'elle sera confirmée.

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:smoke
```

`pnpm format` utilise Oxfmt sur ses formats pris en charge ; les SCSS restent éditables comme sources Sass. Oxlint remplace ESLint, avec les règles TypeScript, React, Next.js et accessibilité. Le build télécharge les polices via `next/font`, puis les héberge avec le site : le navigateur ne contacte pas Google Fonts.

## Architecture

- `src/app/[locale]` : routes et métadonnées, Server Components par défaut.
- `src/components` : présentation ; les interactions uniquement sont clientes (navigation, filtres, thème, contact).
- `src/content/projects.ts` : projets, catégories et sorties musicales dérivées ; champs non confirmés facultatifs.
- `src/content/socials.ts` : email et liens connus, repris de l'ancien portfolio.
- `src/lib/i18n.ts` : langues, traductions communes typées et navigation.
- `src/content/copy.ts` : textes éditoriaux FR/EN séparés des pages.
- `src/content/articles/*.mdx` : articles locaux, validation Zod, brouillons exclus.
- `src/styles` : tokens sémantiques, thèmes et primitives de présentation partagées. Les compositions graphiques et le shell utilisent SCSS Modules.

Pour ajouter un projet, ajouter un objet `Project` dans les données. Les pages, la recherche, les catégories et le sitemap le prennent en compte. Aucun nouveau composant nécessaire. Les images validées peuvent être ajoutées dans `public/` et décrites dans `gallery` avec dimensions et texte alternatif. Elles utilisent `next/image`.

Les textes sont provisoires, fondés uniquement sur les informations fournies et l'ancien portfolio. Les illustrations CSS/SVG sont décoratives : ni captures produit, ni pochettes musicales officielles. Scène WebGL facultative sur l’accueil, fallback CSS/SVG, aucun autoplay. Voir [le guide cinématique](cinematic.md) et [les performances](performance/README.md).

## Langues, thèmes et navigation

`/fr` et `/en` sont explicites et prioritaires. Seule `/` détecte cookie puis `Accept-Language`, FR en repli. Les anciens liens redirigent vers des destinations anglaises fixes, sans détection ni boucle. `/music` est également préservé. `/partners` rejoint désormais Sponsors.

`next-themes` initialise le thème avant affichage et stocke `aurora-theme`. Les boîtes de dialogue HTML natives assurent la modalité, le parcours clavier et Escape. La recherche ⌘K / Ctrl+K couvre pages, projets et articles publiés. Le menu contient les sélecteurs langue/thème.

Les transitions d'entrée, orbites et interactions sont légères ; `prefers-reduced-motion` réduit leurs déplacements ; le mode statique ne fige que la 3D. Aucune interception du défilement.

## Contact

Le formulaire prépare un `mailto:` encodé et ouvre le client de messagerie. Il ne collecte, ne stocke et n'envoie aucune donnée. Le lien email direct reste utilisable. Un client email configuré est nécessaire pour ouvrir le brouillon.

## Dépendances ajoutées

- `next` : App Router, SSR, routes, SEO et images.
- `next-themes` : préférence système et persistance avec initialisation avant affichage.
- `next-mdx-remote`, `gray-matter`, `zod` : compilation MDX locale et métadonnées validées.
- `remark-gfm`, `rehype-pretty-code`, `shiki` : Markdown enrichi et coloration serveur.
- `oxlint`, `oxfmt` : lint et formatage demandés.
- `@playwright/test` : parcours navigateur et responsive. Les tests unitaires utilisent Node sans runner supplémentaire.

Les fichiers MDX sont du code de confiance relu en PR : ne jamais compiler de MDX fourni par les visiteurs.

## Conventions

Conserver les faits éditoriaux séparés de la présentation. Pas de mesure, de stack, de partenaire ou de lien inventé. Imports `@/` pour l'application ; `.ts` explicite pour les modules exécutés aussi par Node. Champs éditoriaux bilingues `Record<Locale,string>`. Validation des paramètres avant accès aux données ; vrai statut 404 si inconnu. N'ajouter `use client` qu'à la frontière d'interaction. Liens et boutons sémantiques, focus visible, aucun bloc vide.

Commits conventionnels contrôlés par commitlint ; lint-staged lance Oxlint/Oxfmt sur les fichiers concernés. CodeQL et dependency review sont conservés. Les changements passent par une PR ; aucune fusion automatique.

## Expérience cinématique

Voir [architecture, lots et garde-fous](cinematic.md). Les profils et mesures avant/après sont conservés dans [performance/](performance/README.md).

### Logo et icônes

Les deux fichiers `public/Logo Tristan*.png` sont les sources fournies par Tristan. `node scripts/brand-assets.mjs` régénère le symbole transparent optimisé de la navbar, le favicon multi-tailles, l'icône PNG et l'icône Apple avec fond. Le script réutilise Sharp fourni par Next.js, sans dépendance supplémentaire. Les conventions de fichiers App Router déclarent automatiquement les icônes dans les pages FR/EN.
