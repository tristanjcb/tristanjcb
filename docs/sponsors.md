# Soutiens automatiques

La page `/fr/sponsors` et son équivalent anglais chargent les soutiens côté serveur. Les deux plateformes sont indépendantes ; un échec ne masque pas l'autre. Aucun SDK ni base de données supplémentaire. Les noms publics normalisés sont conservés dans le cache Next.js pendant une heure, puis revalidés à la prochaine visite. Pas de liste éditoriale à maintenir. Les pages sont dynamiques afin de ne pas figer une absence de configuration au build.

## Configuration unique

Ajouter aux variables privées du projet Vercel (Preview / Production selon le besoin), puis redéployer :

- `GITHUB_SPONSORS_TOKEN` : jeton GitHub capable de lire les sponsors publics via GraphQL. Un PAT classique avec `read:user` **et** `read:org` est nécessaire pour la requête actuelle (les champs des sponsors de type organisation exigent `read:org`) ; aucun droit d'écriture au dépôt requis. Compte cible : `tristanjcb`.
- `BUYMEACOFFEE_TOKEN` : jeton de lecture du tableau de bord développeur Buy Me a Coffee, si cette API reste disponible pour ce compte.

En local : `.env.local`, ignoré par Git. Ne pas transmettre les jetons dans le chat ni les préfixer `NEXT_PUBLIC_`. Sans jeton, la page reste utilisable et présente une indisponibilité de la liste, pas un faux compteur zéro.

## Données et limites

GitHub : GraphQL officiel, sponsors actifs avec `includePrivate:false` et vérification supplémentaire `privacyLevel:PUBLIC`. Utilisateurs et organisations avec leurs avatars publics GitHub (optimisés par Next Image), nom conservé pour l’accessibilité et au survol ; pagination par curseur, déduplication, lien du profil construit depuis un login validé.

Buy Me a Coffee : `/api/v1/supporters`, pagination contrôlée, noms `supporter_name` uniquement avec `support_visibility:1`, remboursements exclus. Jamais de repli vers `payer_name`, email, montant, transaction ou message. Les réponses brutes ne sont pas mises en cache. Le même nom peut apparaître plusieurs fois s'il correspond à plusieurs contributions : l'API ne fournit pas d'identifiant public stable de personne permettant une déduplication fiable. Les dons anonymes ne sont pas nommés.

**L'API Buy Me a Coffee est historique, sa documentation n'est plus maintenue.** La plateforme recommande désormais les webhooks. Ce connecteur de lecture est prêt mais doit être confirmé avec un jeton réel ; il ne garantit pas que l'accès sera disponible sur ce compte. Les abonnements ne sont pas publiés : leur ancien endpoint expose surtout des données de facturation, sans identité publique suffisamment documentée. La section précise donc « soutiens ponctuels publics ». Une intégration webhook pour abonnements nécessiterait un stockage persistant et la validation des schémas publics avant publication ; elle n'est pas simulée ici.

Les appels ont un délai total de 12 secondes par plateforme et au maximum 100 pages. Une réponse partielle, un format inconnu ou un échec HTTP est traité comme indisponible. Les redirections API sont refusées pour ne pas transmettre les jetons à un autre hôte. Aucun détail d'erreur fournisseur ni jeton envoyé au navigateur.

## Sources officielles

- [GitHub Sponsors GraphQL](https://docs.github.com/en/graphql/reference/sponsors)
- [Ancienne référence Buy Me a Coffee](https://developers.buymeacoffee.com/apireference.md)
- [Webhooks Buy Me a Coffee actuels](https://help.buymeacoffee.com/en/articles/15743173-how-to-setup-and-use-buy-me-a-coffee-webhooks)

## Vérification

`pnpm test` couvre la confidentialité, les remboursements, les formats incorrects, la pagination et les pannes avec des réponses simulées. Sans jetons réels, cela ne constitue pas une validation de récupération des sponsors du compte.

## Diagnostic local confirmé

L’API Buy Me a Coffee peut répondre HTTP 200 avec `{"error":"No supporters"}` lorsqu’aucun soutien n’est enregistré : cette réponse est normalisée en liste vide. Les autres erreurs restent des indisponibilités. GitHub peut répondre HTTP 200 avec des erreurs GraphQL `INSUFFICIENT_SCOPES` : le jeton doit inclure `read:org` pour lire les sponsors organisations, en plus de `read:user`. Après modification du contenu de `.env.local`, redémarrer le serveur de développement si Next.js ne recharge pas les variables.

Les soutiens sont présentés sous forme d’avatars. Sans photo fournie par l’API (notamment Buy Me a Coffee historique), un cercle avec initiale remplace la photo sans inventer une identité visuelle.
