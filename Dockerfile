# Utiliser une image de base officielle Node.js
FROM node:18

# Créer un répertoire pour l'application
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install --production

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'application fonctionne
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
