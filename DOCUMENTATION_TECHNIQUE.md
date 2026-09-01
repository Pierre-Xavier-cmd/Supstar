# Documentation technique Supstar

## Présentation

Supstar est une application web de gestion de lieux et de listes de lieux. Elle permet à un utilisateur de créer un compte, de se connecter, de créer des lieux, de créer des listes, d'ajouter des lieux dans une liste et de partager une liste avec d'autres utilisateurs.

## Stack technique

Le frontend de l'application est développé avec React et TypeScript. La navigation est gérée avec React Router. L'interface utilise Material UI pour les composants visuels et Axios pour les appels HTTP vers l'API.

Le backend repose sur Node.js et Express. Les données sont stockées dans MongoDB et manipulées avec Mongoose. L'authentification utilise des tokens JWT et les mots de passe sont hachés avec bcrypt.

## Architecture

L'application est séparée en trois parties : le frontend, l'API backend et la base de données MongoDB.

Côté frontend, `App.tsx` centralise les routes de l'application et `Header.tsx` gère la navigation principale. `Connexion.tsx` correspond à la page de connexion, `Inscription.tsx` à la page d'inscription, `Places.tsx` à l'affichage des lieux, `CreationPlace.tsx` au formulaire de création d'un lieu, `ListePlaces.tsx` à l'affichage des listes, `PlaceDetails.tsx` au détail d'un lieu et `Profil.tsx` à la page du profil utilisateur.

Côté backend, les modèles se trouvent dans `backend/models` et les routes de l'API dans `backend/routes`. Le fichier `backend/middleware/auth.js` vérifie les tokens des routes protégées.

## Modèles de données

Le modèle `User` contient les champs `prenom`, `nom`, `email`, `motDePasse` et `preferences`.

Le modèle `Place` contient les champs `nom`, `adresse`, `ville`, `pays`, `categorie`, `description`, `horaires`, `prix`, `tags`, `photos`, `noteGlobale`, `statut`, `coordonneesGps` et `liste`. Chaque lieu est rattaché à une liste.

Le modèle `List` contient les champs `nom`, `createur`, `membres` et `lieux`. Un membre possède le rôle `createur`, `editeur`, `commentateur` ou `lecteur`.

Le modèle `Avis` contient un lieu, un auteur, une note et un commentaire. Un utilisateur ne peut avoir qu'un seul avis par lieu.

## Authentification et droits

Après une inscription ou une connexion, le backend génère un token JWT et le renvoie au frontend. Ce token est stocké dans `localStorage` et envoyé dans l'en-tête `Authorization` pour les appels protégés.

Les routes des utilisateurs et des listes sont protégées. Pour créer, modifier ou supprimer un lieu, l'utilisateur doit être le créateur ou un éditeur de la liste. Seul le créateur peut inviter de nouveaux membres.

## Routes principales

Les routes principales du frontend sont `/connexion`, `/inscription`, `/liste-lieux`, `/liste-lieux/:id`, `/lieux/:id`, `/creation-place`, `/mon-profil` et `/deconnexion`.

Les principales routes de l'API sont :

```text
POST   /api/users/inscription
POST   /api/users/connexion
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

GET    /api/lists
POST   /api/lists
GET    /api/lists/:id
PUT    /api/lists/:id
DELETE /api/lists/:id
POST   /api/lists/:id/partager
POST   /api/lists/:id/lieu

GET    /api/places?liste=id
POST   /api/places
GET    /api/places/:id
PUT    /api/places/:id
DELETE /api/places/:id

GET    /api/avis/:lieuId
POST   /api/avis/:lieuId
DELETE /api/avis/:lieuId
```

## Fonctionnalités

L'application permet de créer et partager des listes, d'ajouter des lieux, d'afficher des photos à partir de leurs liens, de rechercher et filtrer les lieux et de publier des avis.

Les lieux affichés peuvent être exportés au format JSON ou CSV. Lorsqu'un lieu possède une latitude et une longitude, sa fiche affiche une carte OpenStreetMap centrée sur ses coordonnées.

## Conteneurisation

Le fichier `docker-compose.yml` démarre trois conteneurs : MongoDB, le backend et le frontend. Les deux Dockerfiles se trouvent dans `backend` et `frontend`.

Pour lancer le projet :

```bash
JWT_SECRET=une_cle_a_modifier docker compose up --build
```

Le frontend est disponible sur `http://localhost:5173` et l'API sur `http://localhost:5000`.

Pour arrêter les conteneurs :

```bash
docker compose down
```
