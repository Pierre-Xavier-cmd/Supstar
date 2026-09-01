# Supstar

Application web de gestion et de partage de lieux.

## Lancer le projet

Créer un fichier `.env` à la racine du projet :

```env
JWT_SECRET=une_cle_secrete
```

Puis lancer :

```bash
docker compose up --build
```

Le site est ensuite disponible sur `http://localhost:5173`.

Pour arrêter :

```bash
docker compose down
```

## Documentation

- [Documentation technique](DOCUMENTATION_TECHNIQUE.md)
- [Manuel utilisateur](MANUEL_UTILISATEUR.md)
