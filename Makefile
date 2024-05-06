# Commande pour construire l'image Docker
build:
	sudo docker build -t ytcard .

# Commande pour exécuter le conteneur Docker
run:
	sudo docker run -d -p 3000:3000 --name ytcard ytcard

# Commande pour arrêter et supprimer le conteneur Docker
stop:
	sudo docker stop ytcard && sudo docker rm ytcard

# Commande pour nettoyer l'image Docker
clean:
	sudo docker rmi ytcard

