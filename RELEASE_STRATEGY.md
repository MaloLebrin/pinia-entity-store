# 🚀 Stratégie de Release et Gestion des Branches

## 🌿 Structure des Branches

### Branches Principales

- **`release/0.x.x`** - Version 0.x.x (version actuelle, corrections et améliorations mineures)
- **`release/1.x.x`** - Version 1.x.x (version majeure, nouvelles fonctionnalités)

> **Note :** La branche `main` est obsolète avec cette stratégie. Le développement se fait directement sur les branches de release appropriées.

### Branches de Développement

- **`feature/*`** - Nouvelles fonctionnalités
- **`bugfix/*`** - Corrections de bugs
- **`hotfix/*`** - Corrections urgentes

## 📋 Workflow de Release

### Version 0.x.x (Actuelle)

**Branche :** `release/0.x.x`
**Objectif :** Stabilité, corrections de bugs, améliorations mineures

**Types de changements autorisés :**
- ✅ Corrections de bugs
- ✅ Améliorations de performance
- ✅ Corrections de sécurité
- ✅ Documentation
- ✅ Tests
- ❌ Nouvelles fonctionnalités majeures
- ❌ Changements d'API breaking

**Versioning :**
- Patch : `0.2.9` → `0.2.10` (corrections)
- Minor : `0.2.9` → `0.3.0` (nouvelles fonctionnalités mineures)

### Version 1.x.x (Future)

**Branche :** `release/1.x.x`
**Objectif :** Nouvelles fonctionnalités majeures, refactoring

**Types de changements autorisés :**
- ✅ Nouvelles fonctionnalités
- ✅ Refactoring majeur
- ✅ Changements d'API (avec migration guide)
- ✅ Améliorations de performance
- ✅ Corrections de bugs
- ✅ Documentation

**Versioning :**
- Patch : `1.0.0` → `1.0.1` (corrections)
- Minor : `1.0.0` → `1.1.0` (nouvelles fonctionnalités)
- Major : `1.0.0` → `2.0.0` (breaking changes)

## 🔄 Processus de Release

### 1. Développement direct sur les branches de release

#### Pour la version 0.x.x (corrections et améliorations mineures)
```bash
git checkout release/0.x.x
git pull origin release/0.x.x
# Développer les corrections/améliorations
git commit -m "fix: correction de bug"
git push origin release/0.x.x
```

#### Pour la version 1.x.x (nouvelles fonctionnalités)
```bash
git checkout release/1.x.x
git pull origin release/1.x.x
# Développer les nouvelles fonctionnalités
git commit -m "feat: nouvelle fonctionnalité"
git push origin release/1.x.x
```

### 2. Synchronisation entre branches de release (optionnel)

Si vous voulez porter des corrections de 0.x.x vers 1.x.x :
```bash
git checkout release/1.x.x
git pull origin release/1.x.x
git cherry-pick <commit-hash-from-0.x.x>
git push origin release/1.x.x
```

### 3. Création d'une release

```bash
# Sur la branche de release appropriée
git checkout release/0.x.x
npm version patch  # ou minor/major
git push origin release/0.x.x --tags
```

## 🏷️ Tags et Releases

### Convention de nommage des tags

- **Version 0.x.x :** `v0.2.9`, `v0.3.0`
- **Version 1.x.x :** `v1.0.0`, `v1.1.0`

### Création des releases GitHub

1. Aller sur GitHub → Releases
2. Créer une nouvelle release depuis le tag
3. Rédiger les notes de release
4. Publier

## 🔧 Configuration des Branches

### Protection des branches de release

Les branches `release/*` doivent être protégées :
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ❌ Allow force pushes
- ❌ Allow deletions

### Configuration des workflows GitHub Actions

- **Tests automatiques** sur toutes les branches
- **Build automatique** sur les branches de release
- **Déploiement automatique** sur les tags

## 📚 Migration et Rétrocompatibilité

### Migration 0.x.x → 1.x.x

1. **Phase de préparation :**
   - Développer sur `release/1.x.x`
   - Tester la compatibilité
   - Créer un guide de migration

2. **Phase de transition :**
   - Maintenir les deux versions
   - Support pour la migration
   - Documentation des changements

3. **Phase de stabilisation :**
   - Focus sur `release/1.x.x`
   - Support limité pour `release/0.x.x`
   - Migration recommandée

## 🚨 Gestion des Urgences

### Hotfix sur les branches de release

```bash
# Créer un hotfix depuis la branche de release
git checkout release/0.x.x
git checkout -b hotfix/critical-bug-fix
# Corriger le bug
git commit -m "fix: correction critique"
git checkout release/0.x.x
git merge hotfix/critical-bug-fix
git push origin release/0.x.x
# Supprimer la branche hotfix
git branch -d hotfix/critical-bug-fix
```

## 📊 Monitoring et Maintenance

### Métriques à suivre

- **Temps de résolution des bugs**
- **Fréquence des releases**
- **Qualité du code** (coverage, linting)
- **Satisfaction des utilisateurs**

### Maintenance des branches

- **Nettoyage régulier** des branches feature
- **Archivage** des anciennes versions
- **Documentation** des changements
- **Support** des utilisateurs
