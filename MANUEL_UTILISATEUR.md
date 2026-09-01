# **Manuel utilisateur Supstar**

## **Présentation**

Supstar est une application qui permet de gérer des lieux et des listes de lieux. Elle sert à enregistrer des endroits, consulter leurs informations, les regrouper dans des listes et les partager avec d'autres utilisateurs.

## **Se créer un compte**

Pour utiliser l’application, il faut d’abord créer un compte. Il suffit d’aller sur la page `Inscription`, de remplir le prénom, le nom, l’email et le mot de passe, puis de cliquer sur `S'inscrire`.

## **Se connecter**

Une fois le compte créé, l’utilisateur peut aller sur la page `Connexion`. Il doit saisir son email et son mot de passe, puis cliquer sur `Connexion` pour accéder à son espace.

**Création d’une liste de lieux**

En allant sur la page Mes listes l’utilisateur peut appuyer sur le bouton Créer une liste pour créer une liste de lieux en lui attribuant un nom.

**Ajout d’un lieu à une liste de lieux**

Lorsque l’utilisateur clique sur une liste de lieux il arrive à la page des lieux qui est initialement vide. Il peut créer un lieu en cliquant sur AJOUTER UN LIEU A LA LISTE.L’utilisateur remplit le formulaire avec les informations demandées, puis clique sur le bouton Créer pour enregistrer le lieu.

## **Consulter la liste des lieux**

On peut consulter la liste des lieux depuis la page `Mes lieux.`

L’utilisateur peut parcourir les listes des lieux affichées à l’écran.

En cliquant sur une liste de lieu, il accède à la page des lieux de la liste des lieux en question.

**Consulter les lieux d’une liste**

Après avoir cliqué sur une liste de lieu, l’utilisateur a accès aux lieux de la liste en question.

## **Rechercher un lieu**

Depuis la page des lieux d’une liste concernée , l’utilisateur peut affiner sa recherche grâce à plusieurs filtres. Il peut rechercher un lieu par texte ou par tag, par catégorie, par ville ou par pays, par note minimale, par prix maximum ou encore par statut.

## **Créer une liste**

Pour créer une liste, il faut ouvrir la page des listes, cliquer sur `Créer une liste`, saisir le nom de la liste puis valider. La liste est alors enregistrée dans l’application.

## **Ajouter un lieu à une liste**

Pour cela il doit avoir soit le rôle `editeur` soit le rôle `createur`.

Pour ajouter un nouveau lieu à une liste, l’utilisateur doit d’abord ouvrir la liste concernée. Il clique ensuite sur `Ajouter un lieu à la liste`, remplit le formulaire demandé, puis valide l’ajout en cliquant sur le bouton CREER.

Les coordonnées GPS d’un lieu correspondent à sa latitude et à sa longitude. Elles permettent de placer le lieu sur une carte comme OpenStreetMap.

Quand les coordonnées GPS sont renseignées, une carte OpenStreetMap est affichée sur la fiche du lieu.

Pour ajouter des photos, il faut saisir leurs liens dans le champ `Liens des photos`, en les séparant par des virgules.

## **Exporter les lieux**

Les boutons `Exporter JSON` et `Exporter CSV` téléchargent les lieux affichés dans la liste. Les filtres peuvent être utilisés avant l’export.

## **Partager une liste**

Une liste peut être partagée avec d’autres utilisateurs. Pour cela il faut avoir le rôle Créateur. Il faut ouvrir la liste, cliquer sur `Inviter`, saisir l’email de la personne concernée, choisir son rôle, puis valider. Les rôles disponibles sont `lecteur`, `commentateur`, `editeur`.

## **Se déconnecter**

Pour quitter son compte, il suffit de cliquer sur `Déconnexion dans le header.`

## **Rôles dans une liste**

Chaque utilisateur possède un rôle qui définit ce qu’il peut faire dans une liste.

- `lecteur` : peut consulter la liste, parcourir les lieux qu’elle contient, utiliser les filtres et accéder aux détails d’un lieu. Il ne peut ni ajouter de lieu, ni inviter un utilisateur, ni publier un avis.
- `commentateur` : possède les mêmes droits de consultation que le lecteur. Il peut également laisser, modifier son propre avis sur un lieu de la liste : note, commentaire, ou les deux. Il ne peut pas modifier les lieux ni gérer les membres.
- `editeur` : possède les droits du commentateur. Il peut ajouter un lieu à la liste. Il ne peut pas inviter d’utilisateur.
- `createur` : possède tous les droits disponibles sur la liste. Il peut ajouter des lieux, inviter des utilisateurs, choisir leur rôle, et commenter.
