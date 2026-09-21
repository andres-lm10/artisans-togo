# Artisans Togo

Prototype mobile-first de la plateforme Artisans Togo : services BTP, immobilier, publications, messagerie, devis et parcours PPC-Cash.

## Lancer localement

Le prototype est une application web statique. Servez le dossier avec n'importe quel serveur HTTP, par exemple :

```bash
python3 -m http.server 8080
```

Puis ouvrez `http://localhost:8080`.

## Fonctionnalités du prototype

- Navigation inférieure Accueil, Messages, PPC-Cash, Publier et Profil
- Recherche de professionnels et de biens
- Catégories de conducteurs d'engins
- Discussions avec saisie, pièces jointes, localisation, devis et carte PPC-Cash
- Publication d'articles avec jusqu'à 4 images
- Solde et parcours de recharge, paiement, retrait et historique PPC-Cash
- Parrainage et gestion du profil

Les intégrations Firebase, l'authentification, le stockage des médias et les API officielles Mixx/Moov Money doivent être ajoutés côté serveur avant la mise en production. Les opérations financières de ce prototype sont des démonstrations d'interface et ne déplacent pas réellement d'argent.
