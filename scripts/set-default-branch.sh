#!/bin/bash

# 🎯 Script de Changement de Branche par Défaut
# Usage: ./scripts/set-default-branch.sh <branch_name>

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
    
    # Vérifier qu'on est dans un repo git
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Ce répertoire n'est pas un repository git"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Changement de la branche par défaut
change_default_branch() {
    local new_default_branch=$1
    
    if [ -z "$new_default_branch" ]; then
        log_error "Usage: $0 <branch_name>"
        log_error "Exemple: $0 release/0.x.x"
        exit 1
    fi
    
    log_info "Changement de la branche par défaut vers $new_default_branch..."
    
    # Vérifier que la branche existe
    if ! git show-ref --verify --quiet refs/heads/$new_default_branch; then
        log_error "La branche $new_default_branch n'existe pas localement"
        exit 1
    fi
    
    # Vérifier que la branche existe sur le remote
    if ! git ls-remote --heads origin $new_default_branch | grep -q $new_default_branch; then
        log_error "La branche $new_default_branch n'existe pas sur le remote origin"
        exit 1
    fi
    
    # 1. Changer la branche par défaut locale
    log_info "Mise à jour de la configuration locale..."
    git config --local init.defaultBranch $new_default_branch
    
    # 2. Mettre à jour le HEAD distant
    log_info "Mise à jour du HEAD distant..."
    git remote set-head origin $new_default_branch
    
    # 3. Vérifier que la branche est à jour
    log_info "Vérification de la synchronisation..."
    git fetch origin
    git checkout $new_default_branch
    git pull origin $new_default_branch
    
    log_success "Configuration locale mise à jour vers $new_default_branch"
    log_warning "IMPORTANT: N'oubliez pas de changer la branche par défaut sur GitHub !"
    
    echo ""
    echo "📋 Étapes restantes sur GitHub :"
    echo "1. Aller sur GitHub → Settings → Branches"
    echo "2. Changer 'Default branch' vers $new_default_branch"
    echo "3. Confirmer le changement"
    echo ""
    echo "Ou via GitHub CLI :"
    echo "  gh repo edit --default-branch $new_default_branch"
}

# Affichage de l'aide
show_help() {
    echo "🎯 Script de Changement de Branche par Défaut"
    echo ""
    echo "Usage: $0 <branch_name>"
    echo ""
    echo "Description:"
    echo "  Change la branche par défaut du repository local"
    echo "  et met à jour la configuration Git"
    echo ""
    echo "Arguments:"
    echo "  <branch_name>  Nom de la nouvelle branche par défaut"
    echo ""
    echo "Exemples:"
    echo "  $0 release/0.x.x"
    echo "  $0 release/1.x.x"
    echo ""
    echo "Note: Ce script met à jour la configuration locale."
    echo "      La branche par défaut sur GitHub doit être changée manuellement."
}

# Fonction principale
main() {
    local command=$1
    
    check_prerequisites
    
    case $command in
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            change_default_branch $command
            ;;
    esac
}

# Exécution du script
main "$@"
