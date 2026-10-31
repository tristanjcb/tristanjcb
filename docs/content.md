# Ajouter un article réel

Créer `src/content/articles/mon-article.fr.mdx` :

```mdx
---
title: 'Titre à remplacer par un vrai article'
description: 'Résumé éditorial réel'
locale: fr
slug: mon-article
date: '2026-10-31'
published: false
tags: [Development]
---

## Introduction

Votre texte.
```

Cet exemple reste dans la documentation : aucun faux article n'est publié. Le slug est stable, en minuscules avec tirets. Date ISO réelle et entre guillemets. `published: false` par défaut ; les dates futures restent exclues du site, de la recherche, du flux et du sitemap. Les métadonnées invalides et les doublons font échouer le build.

Créer un fichier EN avec le même slug pour sa traduction. Le temps de lecture est calculé (200 mots/minute, code exclu). Un sommaire apparaît à partir de quatre titres H2/H3. Les blocs de code avec langue sont colorés par Shiki. Le flux RSS combine les articles FR et EN avec des URL distinctes.

N'ajouter une galerie ou un résultat projet qu'après validation. Ne pas renseigner une stack supposée. Pour Kresov, le lien public est connu, mais les versions et outils internes ne sont pas confirmés par son site public ; ils restent donc absents des fiches.
