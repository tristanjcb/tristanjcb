# Cinematic Aurora — architecture et limites

Le contenu est SSR et reste lisible indépendamment de la scène. La 3D enrichit l'accueil ; les pages internes ne la chargent pas. Aucun shader externe, modèle 3D téléchargé, moteur audio, post-traitement ou code visiteur exécutable.

## Choix techniques

**Three.js seul** pour la 3D. React Three Fiber aurait ajouté une seconde couche de rendu pour une seule scène décorative : le renderer isolé et son API de cycle de vie suffisent ici. `MeshPhysicalMaterial` fournit l'iridescence, les lumières sont natives, les positions et morph targets sont générées localement. Pas de shader personnalisé. Les types Three.js sont une dépendance de développement.

**CSS + Web Animations API** pour les interactions. Pas de bibliothèque React d'animation supplémentaire. Les effets vivent dans une frontière `MotionSystem` remplaçable et dans des SCSS Modules. Les transitions n'appellent jamais `preventDefault`, ne retardent pas le router et ne possèdent jamais le focus.

## Modules

- `src/components/cinematic/model.ts` : chapitres, paramètres autorisés, bornes et géométrie déterministe. Tests de fermeture des pôles et de périodicité, pas uniquement de rendu visuel.
- `renderer.ts` : seul module important Three.js, import dynamique ; caméra, matériau, morph targets, particules, lumières et nettoyage GPU.
- `CinematicJourney.tsx` : contenu enfant SSR, préférence de mouvement, chargement différé, détection des chapitres, contrôles Explore et interface narrative.
- `Fallback.tsx` et `Cinematic.module.scss` : matière opalescente CSS/SVG toujours présente avant le GPU et en cas d'erreur.
- `preferences.ts` : préférence locale `aurora-visual-mode`, abonnement React sans décalage SSR.
- `MotionSystem.tsx`, `Motion.module.scss`, `src/styles/_motion.scss` : Curtain, révélations, interactions, arrêt des ornements hors écran.
- `src/content/cinematic.ts` : tous les nouveaux textes FR/EN et le code narratif non exécutable.

## Lots réalisés

1. **Prototype isolé** : géométrie et renderer séparés de React ; paramètres finis, palettes fermées et profils qualité bornés.
2. **Hero** : scène majeure, identité et liens disponibles immédiatement, fallback SSR, introduction de 2,6 secondes sans écran bloquant ni délai de navigation. Skip Intro agit uniquement sur la présentation.
3. **Scrollytelling** : Origin → Development → Music → Creator → Projects par scroll natif. Une seule matière se transforme ; les cartes restent du HTML. Aucun pinning forcé ni interception de molette.
4. **Floating IDE** : `universe.ts`, interface visuelle Vykev sans audio, panneau de composition ; décoratif et secondaire. Masqué sur petit écran pour garder la lecture prioritaire.
5. **Explore** : énergie/densité dans [0,1], trois palettes prédéfinies, reset. Contrôles désactivés si la scène n'est pas disponible. Aucune chaîne utilisateur n'est évaluée.
6. **Transitions** : Curtain de 420 ms, fondu de page de 180 ms, navigation immédiate. L'overlay n'intercepte ni clics ni focus.
7. **Micro-interactions** : révélations, cartes, menu et recherche ; légère réaction au pointeur fin, aucune interaction tactile obligatoire. La touche `*` produit une variation colorée décorative si les mouvements sont permis.
8. **Optimisation** : compilation asynchrone des shaders, profil mobile conservateur, annulation hors écran et au changement de page, comparatif de laboratoire dans `performance/`.

## Garde-fous

- La 3D se charge sur mobile comme sur desktop. Le mode statique conserve le canvas et rend une image fixe ; thème, chapitre et paramètres déclenchent un nouveau rendu ponctuel. Aucun RAF permanent dans ce mode.
- `prefers-reduced-motion` sélectionne initialement la 3D fixe. Une activation explicite permet de l'animer. Cette préférence adoucit séparément les déplacements de l'interface ; le bouton statique ne modifie jamais les animations de l'interface.
- Scène différée de 700 ms. Échec WebGL, import impossible, perte de contexte ou préparation dépassant quinze secondes : fallback CSS/SVG. Aucun rechargement automatique en boucle.
- Antialiasing actif et DPR natif plafonné à 2 sur les deux profils ; géométrie 48/64 segments, 80/200 particules et cadence 30/60 images/s selon le profil.
- La dégradation automatique réduit cadence et particules, jamais la résolution. Le coût CPU échantillonné ne constitue pas une mesure directe de durée GPU.
- RAF suspendu hors de la section globale et quand l'onglet est masqué ; animations des cartes suspendues hors écran.
- ResizeObserver, observers, événements, timers et RAF nettoyés. Géométries, matériaux, listes de rendu et contexte GPU libérés au démontage ; aucun contexte conservé sur les pages internes.
- Le loader n'entoure plus tout le site : les pages statiques livrent leur HTML complet même sans JavaScript. Le squelette reste sur les articles longs ; une navigation `noscript` rend les liens principaux disponibles.

## Vérification et limites matérielles

`pnpm test` vérifie les bornes et les surfaces ; `pnpm test:smoke` couvre la navigation existante, WebGL bloqué, réduction des mouvements, compilation réelle quand le GPU est disponible, thèmes, paramètres clavier, transformations des chapitres, arrêt hors écran, mode statique persistant, perte de contexte, SSR sans JS et tablette FR/EN.

Les captures sont produites dans `test-results/`, non versionnées. Un runner incapable de créer WebGL signale explicitement le scénario GPU ignoré ; il vérifie toujours les fallbacks. Les mesures de laboratoire ne garantissent pas les Core Web Vitals terrain ni les performances sur un téléphone physique. La mémoire GPU en octets et l'énergie consommée ne sont pas exposées de manière fiable ; seuls les comptes de ressources du renderer sont relevés, sans inventer une consommation.
