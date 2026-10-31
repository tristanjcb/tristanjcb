# Bilan de vérification — 31 octobre 2026

Branche : `aurora-foundation`. Main et sa production n'ont pas été modifiés.

## Exécuté localement

- Node 24.22.1 / pnpm 12.16.1.
- Installation avec lockfile figé : réussie.
- Oxlint, Oxfmt check, TypeScript strict : réussis.
- Tests unitaires Node : 6 réussis, dont compilation MDX réelle avec Markdown GFM et coloration Shiki.
- Build Next.js : réussi ; 28 URL canoniques dans le sitemap, pages FR/EN générées.
- Playwright : 10 scénarios réussis en Chromium desktop et émulation mobile. Accès directs aux 14 pages par langue, canonical, langue HTML, absence de débordement horizontal ; menu, Escape et restitution du focus ; recherche, persistance du thème, langue ; filtres, 404, redirections historiques, RSS, sitemap, GitHub et formulaire mailto.
- Inspection visuelle de l'accueil et du menu sur l'aperçu local, y compris breakpoint desktop 1440 px. Aucune erreur/warning console remontée lors de cette inspection.
- Kresov, GitHub, LinkedIn et Discord : réponse HTTP 200 finale lors du contrôle. Une réponse 200 ne prouve pas le contenu ni l'identité d'un profil derrière une page d'authentification.

## Limites

Les tests ne constituent pas un audit WCAG exhaustif, un essai physique sur iPhone/Safari, ni une validation Vercel Preview. Aucun article réel n'est disponible : l'index et le RSS sont volontairement vides. La compilation MDX est vérifiée par une fixture de test, non publiée.

YouTube n'a pas de destination confirmée dans les informations reçues. Son endpoint attend la variable documentée ; aucune URL n'est inventée. Aucune stack détaillée Kresov ni plateforme musicale n'est affirmée. Les champs éditoriaux facultatifs sont omis tant qu'ils ne sont pas confirmés.
