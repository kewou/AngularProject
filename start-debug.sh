#!/bin/bash

# Script de lancement rapide pour le mode debug
# Usage: ./start-debug.sh

echo "🚀 Démarrage du projet Angular en mode DEBUG..."
echo "=============================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Afficher les versions
echo "📋 Versions installées:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo ""
fi

# Nettoyer le cache si nécessaire
echo "🧹 Nettoyage du cache Angular..."
npx ng cache clean
echo ""

# Démarrer en mode debug
echo "🔧 Lancement en mode DEBUG..."
echo "URL: http://localhost:4200"
echo "Backend: http://localhost:8090/beezyApi"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo "=============================================="

npm run start:debug
