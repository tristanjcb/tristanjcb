# Bilan de vérification / 31 octobre 2026

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

## Prompt 03 / Cinematic Aurora

La scène Three.js, le fallback opalescent, les cinq états de matière, le Floating IDE, Explore, Curtain et les micro-interactions sont implémentés. Les modules, lots et limites figurent dans `cinematic.md` ; les mesures de référence, intermédiaires et finales sont dans `performance/`.

Vérifications locales exécutées : installation figée, Oxlint, Oxfmt, types stricts, build, **11 tests unitaires et 20 scénarios navigateur**. Ces scénarios couvrent également WebGL actif sur desktop et mobile à activation explicite, perte de contexte, réduction des mouvements, paramètres clavier, thèmes, pause hors écran, mode statique persistant, tablette et SSR sans JavaScript. Les captures clair/sombre, desktop/mobile et fallback sont générées comme artifacts.

La première CI GitHub cinématique a exécuté les **20 scénarios avec succès, sans ignorer les deux scénarios GPU**, sur un runner distinct du poste local. Les derniers relevés du build corrigé donnent un LCP médian de 56 ms desktop / 644 ms mobile simulé, contre 60 / 604 ms avant la 3D ; le JS gzip chargé est d’environ 305 ko avec scène et 161 ko sur mobile automatique. Les budgets enregistrés passent. Ces valeurs ne sont pas des statistiques terrain.

La transparence des ornements a été corrigée après inspection des captures pour éviter leur écriture dans le depth buffer devant la matière. Les tests de fermeture des pôles préviennent aussi les fissures de surface générative. Le correctif repasse le build et les 20 scénarios. Main et la production restent inchangés ; aucune promotion automatique.

## Révision de l’interface et de la 3D

Les anciens résultats ci-dessus décrivent la version précédente. La révision conserve la 3D en mode statique et sur mobile, indépendamment des animations de l’interface. Thème animé, typographie renforcée, marque Tristan, Sponsors dans la navigation, icônes SVG et destinations sociales fournies par Tristan. YouTube et TikTok pointent volontairement vers leurs plateformes sans identifiant. Les nouvelles mesures et régressions figurent dans `performance/revision.json` et son README.

Vérifications locales de cette révision : build, Oxlint, Oxfmt, typecheck, 11 tests unitaires et 22 tests navigateur réussis, aucun scénario ignoré. Captures Contact et Hero produites pour desktop et mobile ; framebuffer Retina, canvas conservé et immobile, reprise de mouvement, perte WebGL, thèmes et liens sociaux vérifiés.

## Finitions / 3 novembre 2026

README de profil renouvelé avec bannière et logo, liens sociaux confirmés et badges Shields.io. Listes de soutiens via API serveur avec avatars GitHub publics ; données réelles vérifiées localement après ajout de read:org. Le cas Buy Me a Coffee `No supporters` est traité comme liste vide. Coloration TypeScript du Floating IDE générée côté serveur avec Shiki.

Deux thèmes uniquement : sombre par défaut, clair explicite conservé, anciennes préférences système migrées avant initialisation. Le titre de l’accueil FR/EN et des métadonnées de partage est exactement `Tristan Jacob / Portfolio`. Tirets typographiques remplacés par `/`.

Vérifications exécutées : format, lint, typecheck, build, 16 tests unitaires et 26 tests navigateur réussis sur le build de production local. Le test de persistance attend le changement de thème effectif avant rechargement, puisque View Transition applique sa mise à jour de façon asynchrone. Les jetons de `.env.local` restent exclus de Git. Pas de nouvelle validation Vercel dans ce lot, qui est committé localement sans push.
