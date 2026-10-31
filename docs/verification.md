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

## Vérification authentifiée de la Preview et correctif

La session navigateur autorisée a permis de vérifier les 28 pages FR/EN : contenu, langue, canonical et absence de débordement. Menu, thèmes, Escape, retour du focus et recherche avec flèche/Entrée ont été contrôlés, ainsi que les six redirections historiques, robots, le sitemap (28 URL) et le RSS vide. Quatre pages clés ont aussi été vérifiées à 390 px.

Ce contrôle a révélé une erreur serveur sur les slugs inconnus. Le chargement du contenu tolère désormais un dossier absent (cas d'un journal vide omis du bundle serverless) et inclut explicitement les futurs MDX dans le traçage. Les paramètres publiés sont fermés avec `dynamicParams = false` pour obtenir des 404 avant tout rendu streamé. Les tests vérifient aussi le contenu de la 404 bilingue, et pas uniquement le statut HTTP.

Après correctif : build, types, lint et format réussis ; 7 tests unitaires et 10 tests navigateur réussis. Les smoke tests locaux utilisent désormais un serveur dédié au port 3100 afin de ne pas réutiliser un serveur de développement déjà ouvert. La vérification du nouveau déploiement Vercel suit ce correctif ; les parcours authentifiés dans le navigateur ne doivent pas être confondus avec une exécution Playwright distante sans session.
