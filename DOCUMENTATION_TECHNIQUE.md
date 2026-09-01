# Documentation technique Supstar

## Présentation

Supstar est une application web de gestion de lieux et de listes de lieux. Elle permet à un utilisateur de créer un compte, de se connecter, de créer des lieux, de créer des listes, d’ajouter des lieux dans une liste et de partager une liste avec d’autres utilisateurs.

## Stack technique

- Le frontend de l’application est développé avec React et TypeScript. La navigation est gérée avec React Router. L’interface utilise Material UI pour les composants visuels et Axios pour les appels HTTP vers l’API.
- Le backend repose sur Node.js et Express. Les données sont stockées dans MongoDB et manipulées avec Mongoose. L’authentification est gérée avec des tokens JWT.

## Architecture

- Côté frontend, App.tsx centralise la configuration des routes de l’application. Header.tsx gère la navigation principale. Connexion.tsx correspond à la page de connexion, Inscription.tsx à la page d’inscription, Places.tsx à l’affichage des lieux, CreationPlace.tsx au formulaire de création d’un lieu, ListePlaces.tsx à l’affichage des listes, PlaceDetails.tsx au détail d’un lieu et Profil.tsx à la page du profil utilisateur.
- Côté backend, models/User.js définit le modèle utilisateur, models/Place.js le modèle lieu et models/List.js le modèle liste. Les routes principales sont réparties dans routes/users.js pour les utilisateurs, routes/places.js pour les lieux et routes/lists.js pour les listes.

## Modèles de données

- Le modèle User contient les champs prenom, nom, email, motDePasse et preferences.
- Le modèle Place contient les champs nom, adresse, ville, pays, categorie, description, horaires, prix, tags, photos, noteGlobale, statut et coordonneesGps. Un lieu peut aussi contenir un champ liste lorsqu’il est rattaché à une liste.
- Le modèle List contient les champs nom, createur, membres et lieux.

## Authentification

L’application utilise un système d’authentification basé sur JWT. Après une inscription ou une connexion, le backend génère un token et le renvoie au frontend. Le frontend stocke ensuite ce token dans localStorage. Le service d’authentification s’appuie sur ce token pour savoir si l’utilisateur est connecté et pour récupérer ses informations. Les appels API protégés transmettent le token dans l’en-tête Authorization.

## Routes principales

- Côté frontend, les routes principales sont /connexion, /inscription, /places, /lieux/:id, /liste-lieux, /liste-lieux/:id, /creation-place, /mon-profil et /deconnexion.
- Côté backend, les routes utilisateurs sont POST /api/users/inscription, POST /api/users/connexion, GET /api/users et GET /api/users/:id. Les routes liées aux lieux sont GET /api/places, GET /api/places/:id et POST /api/places. Les routes liées aux listes sont GET /api/lists, GET /api/lists/:id, POST /api/lists, POST /api/lists/:id/lieu et POST /api/lists/:id/partager.

## Fonctionnalités

L’application permet l’authentification utilisateur, la création et la consultation de lieux, le filtrage des lieux, la création de listes, l’ajout d’un lieu à une liste ainsi que le partage d’une liste avec attribution d’un rôle.

## Points d’amélioration

Plusieurs améliorations restent possibles. La protection complète des routes peut être renforcée. La gestion de l’état utilisateur peut être centralisée pour éviter certaines incohérences d’affichage. La gestion des erreurs peut être rendue plus homogène entre le frontend et le backend. L’upload réel de photos peut être ajouté à la place d’un traitement simplifié. Enfin, la validation des données peut être améliorée à la fois côté frontend et côté backend.
