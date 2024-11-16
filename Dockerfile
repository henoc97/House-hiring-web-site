# Utilisez l'image officielle Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer npm et pm2 globalement
RUN npm install -g npm@10.9.0
RUN npm install -g pm2

# Installer les dépendances de production
RUN npm install --production

# Copier tout le code source
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application avec pm2
CMD ["pm2", "start", "config/ecosystem.config.js", "--env", "production"]
