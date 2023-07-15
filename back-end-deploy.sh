cd remitano-funny-movies-backend

git restore .docker/backend-evn.sh
git restore .docker/backend-start-docker.sh

git pull

cd .docker
chmod +x backend-evn.sh
chmod +x backend-start-docker.sh

./backend-start-docker.sh