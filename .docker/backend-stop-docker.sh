. ./ws-env.sh

echo "===> stop docker: $APP_NAME"

docker-compose -f backend-docker-compose.yml -p $APP_NAME down