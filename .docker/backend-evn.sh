export DOCKER_NETWORK='nginx-proxy'

export ADMIN_API_HOST='rfm-demo-be.thocbeauty.com'
export VIRTUAL_NETWORK='nginx-proxy'
export VIRTUAL_PORT='3000'
export LETSENCRYPT_ADMIN_API_HOST="$ADMIN_API_HOST"
export LETSENCRYPT_EMAIL='stl@hclnt.com'

export APP_NAME='remitano-funny-movies-backend'
export APP_ENV='dev'
export APP_KEY='base64:3/p6L7rrKi2eVFr3pyMAe0jO2Krv1R9Q9oOsi0463fE:'
export APP_DEBUG='true'
export APP_URL="https://${ADMIN_API_HOST}"
export REDIRECT_HTTPS='true'

export APP_VOLUME_CODE_MOUNT_PATH="/home/applications/data/${APP_NAME}/code"

export NODE_ENV=production
export REDIS_HOST=redis
export REDIS_PORT=6379

export MYSQL_USER=remitano
export MYSQL_PASSWORD=znyhCTVg8tneMdAu
export MYSQL_DB=remitano_funny_videos
export MYSQL_PORT=3307
export MYSQL_HOST=mysql
export DATABASE_URL=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DB}