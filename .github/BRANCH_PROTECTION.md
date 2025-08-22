# 🛡️ Configuration des Branches de Protection

## 📋 Branches à Protéger

### 1. Branche `main`
- **Protection :** ✅ Requise
- **Objectif :** Développement principal, fonctionnalités expérimentales

**Configuration recommandée :**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators
- ❌ Allow force pushes
- ❌ Allow deletions

**Status checks requis :**
- `test` - Tests unitaires et d'intégration
- `build` - Build du package
- `lint` - Vérification du code
- `type:check` - Vérification TypeScript

### 2. Branche `release/0.x.x`
- **Protection :** ✅ Requise
- **Objectif :** Version stable 0.x.x, corrections et améliorations mineures

**Configuration recommandée :**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators
- ❌ Allow force pushes
- ❌ Allow deletions

**Status checks requis :**
- `test` - Tests unitaires et d'intégration
- `build` - Build du package
- `lint` - Vérification du code
- `type:check` - Vérification TypeScript
- `security` - Audit de sécurité

### 3. Branche `release/1.x.x`
- **Protection :** ✅ Requise
- **Objectif :** Version majeure 1.x.x, nouvelles fonctionnalités

**Configuration recommandée :**
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators
- ❌ Allow force pushes
- ❌ Allow deletions

**Status checks requis :**
- `test` - Tests unitaires et d'intégration
- `build` - Build du package
- `lint` - Vérification du code
- `type:check` - Vérification TypeScript
- `security` - Audit de sécurité
- `release-check` - Validation de la release

## 🔧 Configuration via GitHub UI

### Étape 1 : Accéder aux paramètres
1. Aller sur GitHub → Settings
2. Cliquer sur "Branches" dans le menu de gauche
3. Cliquer sur "Add rule" ou "Add branch protection rule"

### Étape 2 : Configurer la protection
1. **Branch name pattern :** `release/*` ou `main`
2. **Protect matching branches :** ✅ Cocher
3. **Require a pull request before merging :** ✅ Cocher
4. **Require approvals :** ✅ Cocher (minimum 1)
5. **Dismiss stale PR approvals when new commits are pushed :** ✅ Cocher
6. **Require status checks to pass before merging :** ✅ Cocher
7. **Require branches to be up to date before merging :** ✅ Cocher
8. **Require linear history :** ✅ Cocher
9. **Include administrators :** ✅ Cocher
10. **Restrict pushes that create files :** ❌ Décocher
11. **Allow force pushes :** ❌ Décocher
12. **Allow deletions :** ❌ Décocher

### Étape 3 : Configurer les status checks
1. **Status checks that are required :**
   - `test` ✅
   - `build` ✅
   - `lint` ✅
   - `type:check` ✅
   - `security` ✅ (pour les branches release)

2. **Require branches to be up to date before merging :** ✅ Cocher

## 🔄 Workflow de Merge

### Pull Request vers `main`
1. **Source :** `feature/*` ou `bugfix/*`
2. **Target :** `main`
3. **Review :** ✅ Requis
4. **Status checks :** ✅ Tous doivent passer
5. **Merge :** ✅ Squash and merge (recommandé)

### Pull Request vers `release/*`
1. **Source :** `main`
2. **Target :** `release/0.x.x` ou `release/1.x.x`
3. **Review :** ✅ Requis
4. **Status checks :** ✅ Tous doivent passer
5. **Merge :** ✅ Merge commit (pour préserver l'historique)

## 🚨 Gestion des Urgences

### Hotfix sur une branche de release
1. **Créer une branche hotfix :**
   ```bash
   ./scripts/release.sh create-hotfix release/0.x.x critical-bug-fix
   ```

2. **Développer la correction :**
   ```bash
   # Faire les modifications
   git add .
   git commit -m "fix: correction critique"
   ```

3. **Merger le hotfix :**
   ```bash
   git checkout release/0.x.x
   git merge hotfix/critical-bug-fix
   git push origin release/0.x.x
   git branch -d hotfix/critical-bug-fix
   ```

4. **Créer une release :**
   ```bash
   ./scripts/release.sh create-release patch release/0.x.x
   ```

## 📊 Monitoring et Maintenance

### Vérifications régulières
- **Statut des branches :** `npm run release:status`
- **Tests automatiques :** Vérifier les workflows GitHub Actions
- **Sécurité :** Vérifier les audits npm
- **Performance :** Monitorer les temps de build et de test

### Nettoyage des branches
- **Archiver** les anciennes branches de release
- **Supprimer** les branches feature mergées
- **Maintenir** la propreté de l'historique

## 🔐 Bonnes Pratiques

### Sécurité
- ✅ Toujours utiliser des pull requests
- ✅ Requérir des reviews de code
- ✅ Exécuter tous les tests avant merge
- ✅ Vérifier la sécurité des dépendances

### Qualité
- ✅ Maintenir une couverture de tests élevée
- ✅ Respecter les conventions de code
- ✅ Documenter les changements
- ✅ Tester sur plusieurs environnements

### Collaboration
- ✅ Communiquer les changements importants
- ✅ Former l'équipe aux nouvelles pratiques
- ✅ Documenter les processus
- ✅ Réviser régulièrement la stratégie
