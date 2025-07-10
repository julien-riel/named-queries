---
description: automatise le workflow complet de développement d'une issue GitHub : assignation, création de branche, analyse du contexte, développement, tests et création de PR.
---

# GitHub Issue Development Workflow

## Description
Cette commande automatise le workflow complet de développement d'une issue GitHub : assignation, création de branche, analyse du contexte, développement, tests et création de PR.

## Commande
```
/github-issue-dev
```

## Alias
```
/gid
```

## Paramètres
- `issue_number` (requis) : Numéro de l'issue GitHub à traiter

## Étapes

### 1. Assignation de l'issue
- Récupérer les informations de l'issue GitHub
- S'assigner automatiquement l'issue
- Afficher le titre et la description de l'issue

### 2. Création de la branche
- Se positionner sur la branche principale (`main` ou `master`)
- Faire un `git pull` pour avoir la dernière version
- Créer une nouvelle branche feature avec le format : `feature/issue-{issue_number}-{description-courte}`
- Checkout sur la nouvelle branche

### 3. Analyse du contexte
- Lister les 10 dernières PR mergées
- Analyser les fichiers modifiés dans ces PR
- Identifier les patterns de code et conventions utilisées
- Rechercher les PR liées à des fonctionnalités similaires
- Générer un résumé des éléments importants à considérer

### 4. Implémentation
- Proposer une structure de fichiers basée sur l'analyse
- Implémenter le code en respectant les patterns identifiés
- Ajouter des commentaires pertinents
- Suivre les conventions de nommage du projet

### 5. Tests
- Vérifier que Docker Compose est actif : `docker-compose ps`
- Si Docker n'est pas up, exécuter : `docker-compose up -d`
- Attendre que tous les services soient prêts
- Exécuter la suite de tests : `npm test` ou `yarn test` (selon le projet)
- Si des tests échouent, corriger et relancer

### 6. Commit et Push
- Faire un `git add` des fichiers modifiés
- Créer un commit avec le message : `feat: [#issue_number] description courte`
- Pousser la branche : `git push origin feature/issue-{issue_number}`

### 7. Création de la PR
- Créer une Pull Request via l'API GitHub
- Titre : `[#issue_number] Titre de l'issue`
- Description incluant :
  - Lien vers l'issue
  - Résumé des changements
  - Tests effectués
  - Screenshots si applicable
- Ajouter les labels appropriés
- Demander une review si configuré

## Exemple d'utilisation
```
/github-issue-dev 123
```

## Configuration requise
- Token GitHub avec les permissions : `repo`, `write:issues`
- Docker et Docker Compose installés
- Accès en écriture au repository

## Gestion d'erreurs
- Si l'issue n'existe pas : afficher une erreur claire
- Si Docker n'est pas installé : proposer d'exécuter les tests localement
- Si des tests échouent : afficher les logs et proposer des corrections
- Si la branche existe déjà : proposer de la supprimer ou d'utiliser un autre nom

## Options avancées
- `--no-tests` : Skip l'exécution des tests
- `--draft` : Créer la PR en mode draft
- `--base <branch>` : Utiliser une branche de base différente de main/master