# 🧪 Application de Test Vue + Pinia

Cette application Vue 3 avec Pinia permet de tester l'adaptateur Pinia de l'Entity Store en conditions réelles.

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
cd packages/pinia-adapter/test/vue-app
npm install
```

### 2. Démarrage du serveur de développement
```bash
npm run dev
```

L'application s'ouvrira automatiquement dans votre navigateur à l'adresse `http://localhost:3000`.

## 🎯 Fonctionnalités testées

### ✅ Gestion des entités
- **Création** : Formulaire pour créer des utilisateurs avec validation
- **Lecture** : Affichage de la liste des utilisateurs avec filtres
- **Mise à jour** : Modification des propriétés des utilisateurs
- **Suppression** : Suppression d'utilisateurs

### ✅ Gestion de l'état
- **Entité courante** : Sélection et affichage de l'utilisateur actuellement sélectionné
- **Entités actives** : Gestion des utilisateurs actifs avec indicateurs visuels
- **État modifié** : Suivi des entités modifiées avec badge "Modifié"

### ✅ Actions globales
- **Réinitialisation** : Remise à zéro du store
- **Utilisateurs de test** : Création automatique d'utilisateurs de démonstration
- **Basculer l'état** : Changement global de l'état modifié

### ✅ Statistiques en temps réel
- **Compteurs** : Total, actifs, modifiés
- **Entité courante** : Affichage de l'utilisateur sélectionné

## 🧪 Tests d'intégration

### Exécution des tests
```bash
npm test
```

### Tests disponibles
- **Store Initialization** : Vérification de l'initialisation
- **Entity Management** : CRUD complet des entités
- **State Management** : Gestion de l'état (courant, actif, modifié)
- **Query Operations** : Filtrage et recherche
- **Validation and Hooks** : Validation des entités et hooks de cycle de vie
- **Performance** : Tests de performance avec grands datasets

## 🏗️ Architecture

### Structure des fichiers
```
vue-app/
├── App.vue              # Composant principal
├── main.ts              # Point d'entrée
├── stores/
│   └── userStore.ts     # Store Pinia utilisant l'adaptateur
├── tests/
│   └── integration.test.ts # Tests d'intégration
├── vite.config.ts       # Configuration Vite
├── tsconfig.json        # Configuration TypeScript
└── package.json         # Dépendances
```

### Flux de données
1. **Vue Component** → Appelle les méthodes du store
2. **Pinia Store** → Utilise l'adaptateur pour la logique métier
3. **Entity Store Core** → Gère l'état et les opérations
4. **Vue Reactivity** → Met à jour automatiquement l'interface

## 🔧 Configuration

### Validation des entités
Le store inclut une validation personnalisée :
- **Nom** : Requis et non vide
- **Email** : Format valide avec @
- **Âge** : Entre 0 et 150

### Hooks de cycle de vie
- `onEntityCreated` : Log lors de la création
- `onEntityUpdated` : Log des modifications
- `onEntityDeleted` : Log lors de la suppression

## 📊 Monitoring

### Console du navigateur
Les hooks de cycle de vie affichent des logs détaillés :
```
Utilisateur créé: {id: "user1", name: "John Doe", ...}
Utilisateur mis à jour: {previous: {...}, current: {...}}
Utilisateur supprimé: {id: "user1", ...}
```

### Vue DevTools
Installez l'extension Vue DevTools pour inspecter :
- L'état du store Pinia
- Les composants Vue
- Les mutations d'état

## 🚨 Dépannage

### Problèmes courants
1. **Erreur de validation** : Vérifiez que tous les champs sont remplis correctement
2. **Store non réactif** : Assurez-vous que Pinia est bien configuré
3. **Erreurs TypeScript** : Vérifiez que les types correspondent

### Logs de débogage
Activez les logs détaillés dans la console du navigateur pour diagnostiquer les problèmes.

## 🎉 Résultats attendus

Avec cette application, vous devriez pouvoir :
- ✅ Créer, lire, modifier et supprimer des utilisateurs
- ✅ Voir la réactivité Vue en action
- ✅ Tester la validation des entités
- ✅ Observer les hooks de cycle de vie
- ✅ Valider les performances avec de grands datasets
- ✅ Confirmer que l'adaptateur Pinia fonctionne parfaitement

Cette application de test démontre que l'adaptateur Pinia s'intègre parfaitement avec Vue 3 et Pinia, offrant une expérience de développement fluide et performante.
