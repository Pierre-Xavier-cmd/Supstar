# Documentation technique

## Technologies

- frontend : React, TypeScript, Vite et Material UI
- backend : Node.js et Express
- base de données : MongoDB avec Mongoose
- connexion : JWT et bcrypt

## Lancer le projet

```bash
git clone https://github.com/Pierre-Xavier-cmd/Supstar.git
cd Supstar
JWT_SECRET=une_cle_a_modifier docker compose up --build
```

Ouvrir `http://localhost:5173`.

Pour arrêter :

```bash
docker compose down
```

## Organisation

- `frontend/src/pages` : pages du site
- `frontend/src/composants` : composants React
- `frontend/src/services` : appels API et connexion
- `backend/models` : modèles MongoDB
- `backend/routes` : routes de l'API
- `backend/middleware/auth.js` : vérification du token

## Routes API

Utilisateurs :

```text
POST /users/inscription
POST /users/connexion
GET  /users
GET  /users/:id
PUT  /users/:id
DELETE /users/:id
```

Listes :

```text
GET  /lists
POST /lists
GET  /lists/:id
PUT  /lists/:id
DELETE /lists/:id
POST /lists/:id/partager
POST /lists/:id/lieu
```

Lieux :

```text
GET  /places?liste=id
POST /places
GET  /places/:id
PUT  /places/:id
DELETE /places/:id
```

Avis :

```text
GET  /avis/:lieuId
POST /avis/:lieuId
DELETE /avis/:lieuId
```

Les rôles d'une liste sont `createur`, `editeur`, `commentateur` et `lecteur`.
