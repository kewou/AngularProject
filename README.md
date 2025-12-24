# AngularProject
Front Angular

## 🐳 Environnement de Développement Dockerisé

### Prérequis
- Docker installé sur votre machine
- Git pour cloner le projet

### 🚀 Démarrage Rapide

#### 1. Construction de l'image Docker
```bash
docker build --target dev -t gestion-loyer-dev .
```

#### 2. Lancement du conteneur
```bash
docker run --rm -p 4200:4200 gestion-loyer-dev
```

#### 3. Accès à l'application
Ouvrez votre navigateur à l'adresse : **http://localhost:4200/beezyApi**

---

## 👥 Guide pour Nouveaux Développeurs

### Configuration Initiale

1. **Cloner le projet**
   ```bash
   git clone <url-du-repository>
   cd AngularProject
   ```

2. **Construire l'image Docker de développement**
   ```bash
   docker build --target dev -t gestion-loyer-dev .
   ```

3. **Lancer le conteneur avec live-reload**
   ```bash
   docker run --rm -p 4200:4200 -v "%cd%\src:/app/src" gestion-loyer-dev
   ```
   
   > **Note Linux/Mac** : Remplacer `%cd%` par `$(pwd)`
   ```bash
   docker run --rm -p 4200:4200 -v "$(pwd)/src:/app/src" gestion-loyer-dev
   ```

4. **Accéder à l'application**
   - URL : http://localhost:4200/beezyApi
   - Les modifications dans `src/` sont automatiquement détectées (hot-reload activé avec polling)

### 🔄 Workflow de Développement Collaboratif

#### Option A : Mode Développement avec Hot-Reload (Recommandé)
Permet de modifier le code en temps réel sans reconstruire l'image :
```bash
docker run --rm -p 4200:4200 -v "%cd%\src:/app/src" gestion-loyer-dev
```

#### Option B : Mode Développement Simple
Sans montage de volume (nécessite rebuild après chaque modification) :
```bash
docker run --rm -p 4200:4200 gestion-loyer-dev
```

#### Option C : Mode Développement avec Nom de Conteneur
Pour gérer plus facilement le conteneur :
```bash
docker run --name gestion-loyer-container -p 4200:4200 -v "%cd%\src:/app/src" gestion-loyer-dev
```
- Arrêter : `docker stop gestion-loyer-container`
- Redémarrer : `docker start gestion-loyer-container`
- Supprimer : `docker rm gestion-loyer-container`

### 🛠️ Commandes Utiles

#### Reconstruire l'image après modification de dépendances
```bash
docker build --no-cache --target dev -t gestion-loyer-dev .
```

#### Accéder au shell du conteneur
```bash
docker exec -it <container-id> sh
```

#### Voir les logs en temps réel
```bash
docker logs -f <container-id>
```

#### Build production (génère dist/)
```bash
docker build --target build -t gestion-loyer-build .
docker run --rm -v "%cd%\dist:/app/dist" gestion-loyer-build
```

### 📝 Bonnes Pratiques pour la Collaboration

1. **Avant de commencer** : Toujours pull les dernières modifications
   ```bash
   git pull origin main
   docker build --target dev -t gestion-loyer-dev .
   ```

2. **Gestion des dépendances** : Si `package.json` change, reconstruire l'image
   ```bash
   docker build --target dev -t gestion-loyer-dev .
   ```

3. **Partage de configuration** : Le Dockerfile et les fichiers de config sont versionnés, donc tous les développeurs ont le même environnement

4. **Backend** : Assurez-vous que le backend est accessible sur `http://localhost:8090/beezyApi` (voir `src/environments/environment.ts`)

### 🐛 Dépannage

**Problème** : Le conteneur ne démarre pas
- Vérifier qu'aucun autre service n'utilise le port 4200 : `netstat -ano | findstr :4200`
- Vérifier les logs : `docker logs <container-id>`

**Problème** : Hot-reload ne fonctionne pas
- S'assurer que le volume est correctement monté avec `-v "%cd%\src:/app/src"`
- Le polling est activé par défaut (CHOKIDAR_USEPOLLING=1)

**Problème** : Erreur ENOENT package.json
- Reconstruire l'image : `docker build --target dev -t gestion-loyer-dev .`

### 🏗️ Architecture du Projet
- **Angular 15** avec base href `/beezyApi/`
- **SCSS** et **Angular Material** (thème indigo-pink)
- **Locale** : Français (fr)
- **Backend** : http://localhost:8090/beezyApi

---

## 📦 Développement Local (sans Docker)

Si vous préférez travailler sans Docker :

```bash
npm install
npm start
```

Accès : http://localhost:4200/beezyApi
