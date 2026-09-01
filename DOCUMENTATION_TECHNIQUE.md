# Documentation technique - Supstar

## 1. Présentation

Supstar est une application web qui permet de créer des listes de lieux, de les partager et de donner un avis sur un lieu.

Le projet est séparé en deux parties :

- `frontend` : interface en React et TypeScript ;
- `backend` : API REST en Node.js et Express ;
- MongoDB : stockage des utilisateurs, listes, lieux et avis.

Le client communique avec l'API à l'adresse `http://localhost:5000/api`.

## 2. Technologies utilisées

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Material UI
- Axios

### Backend

- Node.js
- Express
- MongoDB avec Mongoose
- JSON Web Token pour la connexion
- bcrypt pour le hashage des mots de passe

## 3. Installation avec Docker

La méthode la plus simple utilise Docker Compose. Il faut définir une clé JWT avant de démarrer les conteneurs :

```bash
JWT_SECRET=une_cle_secrete_a_modifier docker compose up
```

Cette commande lance les trois composants du projet : MongoDB, l'API sur le port 5000 et le frontend sur le port 5173. Les données MongoDB sont conservées dans un volume Docker.

Pour arrêter l'application :

```bash
docker compose down
```

La clé utilisée avec `JWT_SECRET` ne doit pas être mise sur GitHub.

## 4. Installation sans Docker

Il faut avoir Node.js, npm et MongoDB installés sur la machine.

Installer le backend :

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend` :

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/supstar
JWT_SECRET=une_cle_secrete_a_modifier
```

Le fichier `.env` contient des informations privées. Il ne doit pas être envoyé sur GitHub.

Lancer le serveur :

```bash
npm run dev
```

Dans un deuxième terminal, installer et lancer le frontend :

```bash
cd frontend
npm install
npm run dev
```

L'adresse du site est affichée par Vite, en général `http://localhost:5173`.

## 5. Organisation du code

Dans le backend :

- `index.js` démarre Express et charge les routes ;
- `config/db.js` ouvre la connexion à MongoDB ;
- `models` contient les schémas Mongoose ;
- `routes` contient les routes de l'API ;
- `middleware/auth.js` vérifie le token JWT.

Dans le frontend :

- `src/pages` contient les différentes pages ;
- `src/composants` contient l'en-tête et la protection des pages ;
- `src/services/api.ts` configure les appels vers l'API ;
- `src/services/authentification.ts` gère le token stocké dans le navigateur.

## 6. Base de données

Quatre collections principales sont utilisées.

### User

Un utilisateur possède un prénom, un nom, un email, un mot de passe et des préférences. L'email est unique. Le mot de passe est hashé avec bcrypt avant l'enregistrement.

### List

Une liste contient un nom, un créateur, des membres et des lieux. Un membre possède un rôle : `createur`, `editeur`, `commentateur` ou `lecteur`.

### Place

Un lieu contient notamment un nom, une adresse, une ville, un pays, une catégorie, une description, un prix, des tags, des photos, une note globale, un statut et des coordonnées GPS. Il est rattaché à une liste.

Les statuts possibles sont : `a_visiter`, `visite` et `favoris`.

### Avis

Un avis est rattaché à un lieu et à un utilisateur. Il contient un commentaire et une note entre 1 et 5. Un utilisateur ne peut avoir qu'un seul avis par lieu. Quand un avis change, la moyenne du lieu est recalculée.

## 7. API REST

Les routes sont préfixées par `/api`.

| Méthode | Route | Utilité |
| --- | --- | --- |
| POST | `/users/inscription` | créer un compte |
| POST | `/users/connexion` | se connecter |
| GET | `/lists` | récupérer les listes accessibles |
| POST | `/lists` | créer une liste |
| GET | `/lists/:id` | récupérer une liste |
| PUT | `/lists/:id` | renommer une liste |
| DELETE | `/lists/:id` | supprimer une liste |
| POST | `/lists/:id/partager` | ajouter un membre |
| GET | `/places?liste=id` | récupérer les lieux d'une liste |
| POST | `/places` | créer un lieu |
| GET | `/places/:id` | afficher un lieu |
| PUT | `/places/:id` | modifier un lieu |
| DELETE | `/places/:id` | supprimer un lieu |
| GET | `/avis/:lieuId` | récupérer les avis d'un lieu |
| POST | `/avis/:lieuId` | créer ou modifier son avis |
| DELETE | `/avis/:lieuId` | supprimer son avis |

Les routes des listes et les routes d'écriture des avis demandent un token. Il est envoyé dans l'en-tête HTTP :

```text
Authorization: Bearer TOKEN
```

## 8. Gestion des droits

- Créateur : gère sa liste, invite des membres et ajoute des lieux.
- Éditeur : peut ajouter des lieux et modifier le nom de la liste.
- Commentateur : peut consulter et commenter les lieux.
- Lecteur : peut seulement consulter la liste.

Le backend récupère l'identifiant de l'utilisateur depuis le token. Il vérifie ensuite si cet utilisateur est le créateur ou un membre de la liste.

## 9. Vérifications

Le frontend peut être vérifié avec :

```bash
cd frontend
npm run lint
npm run build
```

Il n'y a pas encore de tests automatiques pour le backend. Les routes peuvent être testées avec Postman ou directement depuis l'interface.

## 10. Limites actuelles

Certaines fonctionnalités demandées ne sont pas encore terminées : la carte OpenStreetMap, l'import/export de fichiers, OAuth2 et l'envoi réel d'une photo.

L'adresse de l'API est écrite directement dans le frontend. Pour un déploiement, il faudrait utiliser une variable d'environnement et limiter CORS au domaine du site.
