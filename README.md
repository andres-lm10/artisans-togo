# Artisans Togo — application React Native

Application mobile React Native/Expo pour connecter les artisans BTP, les vendeurs de matériaux, l'immobilier et les clients.

## Démarrage

```bash
npm install
npx expo start
```

Scannez le QR code avec Expo Go, ou utilisez `npm run android` / `npm run ios`.

## Inclus dans cette première version native

- Navigation mobile Accueil, Discussions, PPC-Cash, Publier et Profil
- Recherche de prestataires, matériaux, engins et biens immobiliers
- Discussion avec saisie de message, trombone et envoi
- Devis et carte PPC-Cash avec validité affichée de 5 minutes
- Publication d'article et sélection de jusqu'à quatre images via la galerie
- Solde, recharge, paiement et retrait PPC-Cash en parcours d'interface
- Profil, métier et zones de travail

Les appels Firebase, l'authentification, Firestore/Storage et les API officielles Mixx/Moov Money doivent être branchés côté serveur avant la production. Les paiements dans cette version sont des écrans de démonstration et ne déplacent pas encore de fonds.
