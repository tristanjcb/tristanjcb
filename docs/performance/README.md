# Performances / avant et après la 3D

Mesures du **31 octobre 2026**, sur le même poste, build Next.js de production. Trois contextes Chromium froids par profil pour la référence et la version complète. Desktop : 1440 × 1000, DPR 1. Mobile simulé : 390 × 844, CPU ×4, RTT 100 ms, téléchargement 200 000 octets/s. Une mesure intermédiaire par profil est conservée dans `hero.json` ; ce relevé unique est indicatif.

## Révision : 3D systématique et haute définition

Le relevé `revision.json` remplace la politique mobile décrite historiquement ci-dessous. Trois essais froids par profil : desktop LCP médian **56 ms**, JS gzip **309 990 octets**, tâches longues **203 ms** ; mobile simulé LCP **776 ms**, JS gzip **304 122 octets**, tâches longues **290 ms**. CLS médian : 0,00033 / 0,00025. Interaction échantillonnée : 72 / 56 ms. 6 draw calls, 7 432 / 4 968 triangles.

Le mobile charge désormais environ **143 ko gzip supplémentaires** par rapport à l'ancien fallback automatique, avec environ **286 ms** de tâches longues supplémentaires et **132 ms** de LCP médian supplémentaire. C'est le coût mesuré du choix demandé de conserver la 3D. Les images fixes conservent aussi ce chargement initial, puis arrêtent la boucle de rendu.

Budgets actuels : JS gzip ≤335 000 octets sur les deux profils ; LCP ≤2,5 s et écart ≤250 ms par rapport à la fondation ; CLS ≤0,02 ; interaction laboratoire ≤100 ms ; tâches longues ≤250 ms desktop / 400 ms mobile ; RAF P95 ≤50 ms ; ≤8 draw calls et ≤8 000 triangles. Antialiasing actif, DPR natif plafonné à 2 sans dégradation automatique de résolution. Le benchmark reste à DPR 1 pour comparer les anciens relevés ; les tests navigateur vérifient séparément le framebuffer Retina.

`pnpm perf:check` vérifie maintenant `revision.json`. Les tableaux ci-dessous documentent **l'ancienne version**, conservés pour comparaison ; leurs choix de fallback mobile et de DPR ne s'appliquent plus.

## Résultats historiques de laboratoire

| Profil        | Version                           | LCP médian | CLS médian | JS gzip chargé | Échantillon interaction | Tâches longues cumulées |
| ------------- | --------------------------------- | ---------: | ---------: | -------------: | ----------------------: | ----------------------: |
| Desktop       | Fondation                         |      60 ms |          0 |         161 ko |                   64 ms |                    0 ms |
| Desktop       | Cinématique avec WebGL            |      60 ms |    0,00010 |         305 ko |                   72 ms |                  205 ms |
| Mobile simulé | Fondation                         |     604 ms |    0,00016 |         155 ko |                   56 ms |                   14 ms |
| Mobile simulé | Cinématique, fallback automatique |     644 ms |    0,00016 |         161 ko |                   56 ms |                    4 ms |

Les fichiers JSON contiennent les valeurs exactes et chaque essai. Les derniers relevés incluent l’identifiant du build ; `sourceDirty: true` indique une collecte avant commit, à partir du commit de base identifié. `ko` utilise ici 1 000 octets. La page interne `/fr/projects`, contrôlée séparément sur un essai par profil, ne crée aucun canvas : environ 172 ko gzip desktop / 166 ko mobile, sans Three.js.

**Régression explicite :** la 3D ajoute environ 143 ko gzip sur desktop et 203 ms de tâches longues cumulées au démarrage différé. Elle n'est donc pas gratuite. La compilation asynchrone, le délai de chargement, l'absence de textures/modèles externes et le fallback mobile limitent l'impact. Le relevé intermédiaire du premier Hero affichait 249 ms de tâches longues, mais un seul essai ne permet pas d'attribuer précisément l'écart à une optimisation isolée.

Le renderer en fonctionnement relève 6 draw calls, 4 géométries, 2 textures internes et 4 440 triangles sur le profil desktop. Le temps CPU d'un frame échantillonné est proche de 0,1 ms ; il **ne mesure pas** la durée d'exécution GPU. Le P95 des intervalles RAF navigateur est proche de 16,7 ms : il ne signifie pas que la scène, volontairement plafonnée, rend à 60 FPS.

## Budgets

| Mesure                          | Budget                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- |
| LCP laboratoire mobile          | ≤2,5 s et régression ≤150 ms sur le même profil                             |
| CLS laboratoire                 | ≤0,02                                                                       |
| Interaction laboratoire         | ≤100 ms sur ces profils                                                     |
| JS gzip mobile automatique      | ≤180 000 octets                                                             |
| JS gzip desktop avec scène      | ≤335 000 octets                                                             |
| JS gzip page interne            | Cible ≤180 000 octets, aucun import Three.js                                |
| Tâches longues au chargement    | ≤250 ms desktop avec 3D ; ≤100 ms mobile automatique                        |
| Intervalles RAF navigateur P95  | ≤50 ms                                                                      |
| Géométrie                       | ≤8 draw calls, ≤6 500 triangles                                             |
| DPR                             | ≤1 sur petit écran/appareil modeste ; ≤1,5 desktop                          |
| Particules                      | ≤80 sur petit écran/appareil modeste ; ≤200 desktop ; ≤60 après dégradation |
| Assets binaires supplémentaires | Aucun modèle, texture HDR, image ou audio téléchargé                        |

`pnpm perf:check` vérifie les JSON enregistrés ; **ce n'est pas un benchmark du code courant**. Refaire les mesures avant de conclure après une modification de scène.

## Reproduire

```sh
pnpm build
pnpm start --port 3100
# Dans un second terminal, sans tests GPU ou autres benchmarks simultanés :
PERF_LABEL=revision pnpm perf
pnpm perf:check
PERF_LABEL=internal PERF_RUNS=1 PERF_PATH=/fr/projects pnpm perf
```

`PERF_URL` permet de viser un serveur différent. Ne pas utiliser une URL Vercel protégée sans accès autorisé ; la page de connexion ne doit jamais être mesurée comme le portfolio.

## Limites et suite recommandée

Les Core Web Vitals terrain (75e percentile des vraies visites, notamment INP) ne sont pas disponibles ici. L'échantillon Event Timing après ouverture du menu est une approximation d'interaction en laboratoire, **pas un INP terrain**. Le CLS est le cumul observé sans interaction, sans agrégation de terrain par fenêtres. Les chargements réseau du serveur local et la simulation CPU ne remplacent pas un appareil physique.

Le compteur `performance.memory` est grossier et plafonné/arrondi selon le navigateur : il n'est pas utilisé pour annoncer une consommation mémoire. La mémoire GPU en octets, les watts et la température ne sont pas mesurables de manière fiable dans cette session. Les compteurs de ressources Three.js documentent la complexité et les tests vérifient l'arrêt et le nettoyage, sans inventer de mesure matérielle.

Avant activation plus large sur mobile, tester un Android d'entrée de gamme et Safari iOS, puis recueillir des données terrain avec consentement et périmètre appropriés. Le fallback reste réservé à une absence ou une erreur WebGL ; le mode statique conserve une image 3D. Si le coût de démarrage desktop dépasse le budget, préférer une activation explicite ou un matériau plus simple à de nouveaux effets.
