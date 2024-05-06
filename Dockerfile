# Utiliser une image Node.js comme base
FROM node:alpine

# Créer le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les dépendances du projet et installer les packages
COPY package.json .
COPY package-lock.json .

RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande par défaut pour exécuter le serveur Next.js
CMD ["npm", "run", "dev"]

