####################################################################
# Docker multi-stage pour application Angular "gestion-loyer"
# Objectifs:
#  - Eviter ENOENT /app/package.json (chemin unifié /app)
#  - Séparer dépendances, dev (ng serve), build prod (ng build), runtime nginx
#  - Réduire taille image prod (seuls fichiers statiques)
#  - Faciliter live-reload sans écraser node_modules
####################################################################

#-------------------------------------------------------------------
# 1. Base deps (cache npm + sources)
#-------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
ENV NODE_ENV=development \ 
    NG_CLI_ANALYTICS=false
COPY package*.json ./
RUN npm ci
# Copier uniquement le reste après install pour garder le cache
COPY . .

#-------------------------------------------------------------------
# 2. Dev (ng serve) – hot reload
#   (Ne monte PAS tout le projet sur /app: monte éventuellement /app/src)
#-------------------------------------------------------------------
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development \ 
    NG_CLI_ANALYTICS=false \ 
    CHOKIDAR_USEPOLLING=1
COPY --from=deps /app /app
RUN adduser -D appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 4200
# Option: retirer --poll 2000 du script start et ne garder que CHOKIDAR_USEPOLLING
CMD ["npm","run","start"]

#-------------------------------------------------------------------
# 3. Build (production) – génère dist/gestion-loyer
#-------------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app
ENV NODE_ENV=production \ 
    NG_CLI_ANALYTICS=false
COPY --from=deps /app /app
RUN npm run build

#-------------------------------------------------------------------
# 4. (Optionnel) Tests headless (décommenter si specs ajoutées)
#-------------------------------------------------------------------
# FROM build AS test
# RUN npm test -- --watch=false --browsers=ChromeHeadless

#-------------------------------------------------------------------
# 5. Runtime Nginx (prod)
#-------------------------------------------------------------------
FROM nginx:1.27-alpine AS prod
ARG APP_DIST=gestion-loyer
COPY --from=build /app/dist/${APP_DIST} /usr/share/nginx/html/beezyApi
# Config SPA (fallback sur index)
RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html/beezyApi;\n  index index.html;\n  location /beezyApi/ {\n    try_files $uri $uri/ /beezyApi/index.html;\n  }\n  location / {\n    return 301 /beezyApi/;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

#-------------------------------------------------------------------
# Utilisation rapide:
#   Dev  : docker build -t gestion-loyer-dev --target dev . \
#          && docker run --rm -p 4200:4200 gestion-loyer-dev
#   Prod : docker build -t gestion-loyer-prod --target prod . \
#          && docker run --rm -p 8080:80 gestion-loyer-prod
# Montage code (optionnel DEV uniquement):
#   docker run -it --rm -p 4200:4200 \
#     -v ${PWD}/src:/app/src gestion-loyer-dev
#   (NE PAS monter -v ${PWD}:/app sinon package.json sera masqué)
#-------------------------------------------------------------------
