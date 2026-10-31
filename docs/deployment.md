# Préparer la publication Vercel

La branche `aurora-foundation` remplace Vite sur une PR vers `main`. Aucun déploiement de production n'est nécessaire pour les vérifications locales. Les anciens assets sont supprimés à la demande du propriétaire, sauf robots, sitemap et le badge `.github/powered-by-vercel.svg`.

## Preview avant fusion

Vérifier le projet Git connecté, la branche de production `main`, le preset Next.js et l'absence d'override hérité `dist` / Vite. Le `vercel.json` versionné définit Next.js et les commandes pnpm ; ne pas modifier les réglages partagés de production pour tester une Preview. Un projet Preview séparé est préférable si un override global empêche le build.

Node local/CI est 24.22.1 ; `engines.node=24.x` cible Vercel. Vercel gère ses patchs : une version exacte 24.22.1 ne peut être garantie sur son runtime géré.

Après obtention d'une URL Preview :

```sh
PLAYWRIGHT_BASE_URL=https://URL-PREVIEW-VERCEL pnpm test:smoke
```

La Preview doit être accessible à ce runner (lever la protection seulement avec les réglages autorisés du projet). Contrôler accès directs et rechargements FR/EN, 404, redirections historiques, RSS, robots, sitemap et image Open Graph. Les tests locaux ne constituent pas une validation Vercel Preview.

## Domaine et retour arrière

Canonical unique : `https://tristan.kresov.com`. Configurer le domaine sans www comme principal lors de la publication et le www comme redirection vers celui-ci, sans règle inverse. Les routes connues sont localisées, les endpoints techniques ne le sont pas. Ne pas ajouter de redirection externe YouTube avant confirmation du lien. Sans cette option, `/youtube` répond 503 avec noindex et un message d'attente, sans fausse destination.

Ne pas promouvoir ni fusionner avant revue du contenu et validation de la Preview. Conserver l'ancien déploiement Vercel pour un rollback via le dashboard. Le retour arrière de code peut ensuite être effectué par PR de revert.

## Liens et contenu restant à confirmer

- Kresov : `https://kresov.com` répond avec une redirection vers `https://www.kresov.com/` (200 lors de la vérification).
- GitHub : profil public repris de l'ancien site.
- LinkedIn / Discord : identifiants repris de l'ancien site ; les protections et authentifications des plateformes peuvent empêcher une validation automatique du profil.
- Stack Kresov, détails DockerScope, liens d'écoute, YouTube : confirmation du propriétaire nécessaire avant ajout.
- Aucun portrait, pochette officielle, partenaire ou article n'est inventé.
