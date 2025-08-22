#!/bin/bash

# 🚀 Script de Gestion des Releases
# Usage: ./scripts/release.sh [command] [options]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier qu'on est dans un repo git
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Ce répertoire n'est pas un repository git"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Création d'une nouvelle release
create_release() {
    local version_type=$1
    local release_branch=$2
    
    if [ -z "$version_type" ] || [ -z "$release_branch" ]; then
        log_error "Usage: create_release <patch|minor|major> <release_branch>"
        exit 1
    fi
    
    log_info "Création d'une release $version_type sur $release_branch..."
    
    # Vérifier que la branche de release existe
    if ! git show-ref --verify --quiet refs/heads/$release_branch; then
        log_error "La branche $release_branch n'existe pas"
        exit 1
    fi
    
    # Basculer sur la branche de release
    git checkout $release_branch
    git pull origin $release_branch
    
    # Mettre à jour la version
    local current_version=$(npm version $version_type --no-git-tag-version)
    log_info "Version mise à jour: $current_version"
    
    # Commiter les changements
    git add package.json package-lock.json
    git commit -m "chore: bump version to $current_version"
    
    # Créer le tag
    git tag -a "v$current_version" -m "Release v$current_version"
    
    # Pousser les changements et le tag
    git push origin $release_branch
    git push origin "v$current_version"
    
    log_success "Release v$current_version créée avec succès sur $release_branch"
}

# Merge depuis une branche de release vers une autre
merge_between_releases() {
    local source_branch=$1
    local target_branch=$2
    
    if [ -z "$source_branch" ] || [ -z "$target_branch" ]; then
        log_error "Usage: merge_between_releases <source_branch> <target_branch>"
        exit 1
    fi
    
    log_info "Merge depuis $source_branch vers $target_branch..."
    
    # Vérifier que les branches existent
    if ! git show-ref --verify --quiet refs/heads/$source_branch; then
        log_error "La branche source $source_branch n'existe pas"
        exit 1
    fi
    
    if ! git show-ref --verify --quiet refs/heads/$target_branch; then
        log_error "La branche cible $target_branch n'existe pas"
        exit 1
    fi
    
    # Basculer sur la branche cible
    git checkout $target_branch
    git pull origin $target_branch
    
    # Merger depuis la branche source
    git merge $source_branch --no-ff -m "Merge $source_branch into $target_branch"
    
    # Pousser les changements
    git push origin $target_branch
    
    log_success "Merge depuis $source_branch vers $target_branch terminé"
}

# Création d'un hotfix
create_hotfix() {
    local release_branch=$1
    local hotfix_name=$2
    
    if [ -z "$release_branch" ] || [ -z "$hotfix_name" ]; then
        log_error "Usage: create_hotfix <release_branch> <hotfix_name>"
        exit 1
    fi
    
    log_info "Création d'un hotfix $hotfix_name sur $release_branch..."
    
    # Vérifier que la branche de release existe
    if ! git show-ref --verify --quiet refs/heads/$release_branch; then
        log_error "La branche $release_branch n'existe pas"
        exit 1
    fi
    
    # Créer la branche hotfix
    local hotfix_branch="hotfix/$hotfix_name"
    git checkout -b $hotfix_branch $release_branch
    
    log_success "Branche hotfix $hotfix_branch créée depuis $release_branch"
    log_info "Faites vos modifications, puis utilisez:"
    log_info "  git add . && git commit -m 'fix: $hotfix_name'"
    log_info "  git checkout $release_branch"
    log_info "  git merge $hotfix_branch"
    log_info "  git push origin $release_branch"
    log_info "  git branch -d $hotfix_branch"
}

# Affichage de l'aide
show_help() {
    echo "🚀 Script de Gestion des Releases"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commandes:"
    echo "  create-release <patch|minor|major> <release_branch>  Créer une nouvelle release"
    echo "  merge-releases <source> <target>                     Merger entre branches de release"
    echo "  create-hotfix <release_branch> <hotfix_name>        Créer un hotfix"
    echo "  status                                              Afficher le statut des branches"
    echo "  help                                                 Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 create-release patch release/0.x.x"
    echo "  $0 create-release minor release/1.x.x"
    echo "  $0 merge-releases release/0.x.x release/1.x.x"
    echo "  $0 create-hotfix release/0.x.x critical-bug-fix"
}

# Affichage du statut
show_status() {
    log_info "Statut des branches de release:"
    echo ""
    
    # Branches de release
    for branch in release/0.x.x release/1.x.x; do
        if git show-ref --verify --quiet refs/heads/$branch; then
            echo "🏷️  $branch:"
            git log --oneline -5 $branch
        else
            echo "❌ $branch: n'existe pas"
        fi
        echo ""
    done
    
    # Tags récents
    echo "📦 Tags récents:"
    git tag --sort=-version:refname | head -5
}

# Fonction principale
main() {
    local command=$1
    
    check_prerequisites
    
    case $command in
        "create-release")
            create_release $2 $3
            ;;
        "merge-releases")
            merge_between_releases $2 $3
            ;;
        "create-hotfix")
            create_hotfix $2 $3
            ;;
        "status")
            show_status
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            log_error "Commande inconnue: $command"
            show_help
            exit 1
            ;;
    esac
}

# Exécution du script
main "$@"
