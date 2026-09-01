# Manuel utilisateur - Supstar

## 1. Accéder à l'application

Une fois le frontend et le backend démarrés, ouvrir l'adresse donnée par Vite dans un navigateur, normalement `http://localhost:5173`.

Il faut créer un compte avant de pouvoir utiliser les listes.

## 2. Créer un compte

1. Cliquer sur **Inscription** dans le menu.
2. Saisir le prénom, le nom et l'adresse email.
3. Choisir un mot de passe et le confirmer.
4. Cliquer sur **S'inscrire**.

Après l'inscription, l'utilisateur est connecté et arrive sur la page de ses listes.

Si l'adresse email existe déjà ou si les deux mots de passe sont différents, un message d'erreur est affiché.

## 3. Se connecter

1. Cliquer sur **Connexion**.
2. Entrer l'email et le mot de passe du compte.
3. Cliquer sur le bouton **Connexion**.

La connexion reste active grâce à un token enregistré dans le navigateur. Il est valable pendant sept jours.

## 4. Gérer ses listes

La page **Mes listes** affiche les listes créées par l'utilisateur et celles qui lui ont été partagées.

Pour créer une liste :

1. Cliquer sur **Créer une liste**.
2. Donner un nom à la liste.
3. Valider avec **Créer**.

Il est possible de rechercher une liste avec son nom. Un clic sur une carte ouvre les lieux de cette liste.

## 5. Partager une liste

Le créateur de la liste peut cliquer sur **Inviter**. Il doit entrer l'email d'un utilisateur déjà inscrit et choisir un rôle :

- lecteur : consulte la liste ;
- commentateur : consulte et donne un avis ;
- éditeur : ajoute des lieux ;
- créateur : rôle avec des droits élevés.

L'invitation ajoute directement l'utilisateur à la liste. Aucun email n'est envoyé.

## 6. Ajouter un lieu

Le créateur et les éditeurs voient le bouton **Ajouter un lieu à la liste**.

Les champs principaux sont le nom, l'adresse, la ville et le pays. On peut aussi ajouter une catégorie, une description, des tags, des liens vers des photos, un prix, des horaires, un statut et des coordonnées GPS.

Pour les photos, il faut saisir une ou plusieurs adresses d'images séparées par des virgules. Le bouton de sélection de fichier n'envoie pas encore le fichier au serveur.

Le statut doit correspondre à une de ces valeurs :

- `a_visiter` ;
- `visite` ;
- `favoris`.

Cliquer sur **Créer** pour enregistrer le lieu.

## 7. Rechercher un lieu

Dans une liste, les lieux peuvent être filtrés avec :

- une recherche texte ;
- la ville ou le pays ;
- la catégorie ;
- une note minimale ;
- un prix maximum ;
- le statut.

Les filtres sont appliqués directement dans la page. Mettre la note ou le prix à `0` permet de ne pas utiliser ce filtre.

## 8. Consulter et noter un lieu

Cliquer sur un lieu pour ouvrir sa fiche. La page affiche ses informations et les avis déjà publiés.

Un créateur, un éditeur ou un commentateur peut saisir un commentaire, choisir une note de 1 à 5, puis envoyer l'avis. Il est aussi possible d'envoyer seulement une note ou seulement un commentaire.

Si le même utilisateur envoie un nouvel avis sur le même lieu, son ancien avis est remplacé. La note moyenne du lieu est ensuite recalculée.

## 9. Profil et déconnexion

La page **Profil** affiche le nom, l'email, l'identifiant et les préférences enregistrées dans le token.

Pour fermer la session, cliquer sur **Déconnexion**. Le token est supprimé du navigateur.

## 10. Problèmes courants

- **Le site charge mais rien ne s'affiche** : vérifier que le backend fonctionne sur le port 5000.
- **Erreur MongoDB** : vérifier que MongoDB est lancé et que `MONGO_URI` est correcte dans le fichier `.env`.
- **Accès non autorisé** : se déconnecter puis se reconnecter. Le token peut être absent ou expiré.
- **Impossible d'inviter une personne** : elle doit déjà posséder un compte Supstar.
- **Impossible d'ajouter un lieu** : vérifier le rôle dans la liste et remplir les champs obligatoires.

La carte, l'import et l'export ne sont pas disponibles dans la version actuelle.
