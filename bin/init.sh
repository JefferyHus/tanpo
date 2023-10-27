#!/bin/bash

# capture arguments passed to the script
for ARGUMENT in "$@"
do
  KEY=$(echo $ARGUMENT | cut -f1 -d=)
  VALUE=$(echo $ARGUMENT | cut -f2 -d=)

  case "$KEY" in
    NODE_ENV) NODE_ENV=${VALUE} ;;
    MIGRATE) MIGRATE=${VALUE} ;;
    MIGRATE_NAME) MIGRATE_NAME=${VALUE} ;;
    PORT) PORT=${VALUE} ;;
    POSTGRES_PORT) POSTGRES_PORT=${VALUE} ;;
    *)
  esac
done

# set defaults
NODE_ENV=${NODE_ENV:-development}
MIGRATE=${MIGRATE:-false}
MIGRATE_NAME=${MIGRATE_NAME:-}
PORT=${PORT:-3000}
POSTGRES_PORT=${POSTGRES_PORT:-5432}

# check if any process is already running on $PORT
echo "\033[0;32m[INFO]: Checking if any process is already running on server port $PORT\033[0m"
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
  # check if docker container is running on $PORT
  if docker ps | grep -q "boilerplate-api"; then
    echo "\033[0;31m[ERROR]: Docker container is already running on port $PORT.\033[0m"
    echo "\033[0;32m[INFO]: Stopping the docker container...\033[0m"
    docker stop boilerplate-api
  else
    echo "\033[0;31m[ERROR]: Something is already running on port $PORT.\033[0m"
    exit 1
  fi
fi

# check if any process is already running on $POSTGRES_PORT
echo "\033[0;32m[INFO]: Checking if any process is already running on database port $POSTGRES_PORT\033[0m"
if lsof -Pi :$POSTGRES_PORT -sTCP:LISTEN -t >/dev/null ; then
  # check if docker container is running on $POSTGRES_PORT
  if docker ps | grep -q "boilerplate-database"; then
    echo "\033[0;31m[ERROR]: Docker container is already running on port $POSTGRES_PORT.\033[0m"
    echo "\033[0;32m[INFO]: Stopping the docker container...\033[0m"
    docker stop boilerplate-database
  else
    echo "\033[0;31m[ERROR]: Something is already running on port $POSTGRES_PORT.\033[0m"
    exit 1
  fi
fi

# export environment variables
echo "\033[0;32m[INFO]: Exporting environment variables...\033[0m"
export NODE_ENV=$NODE_ENV
export MIGRATE=$MIGRATE
export MIGRATE_NAME=$MIGRATE_NAME
export PORT=$PORT
export POSTGRES_PORT=$POSTGRES_PORT

# create docker network if it does not exist
echo "\033[0;32m[INFO]: Creating docker network...\033[0m"
if ! docker network ls | grep -q "boilerplate_network"; then
  docker network create boilerplate_network
fi

# build the project
echo "\033[0;32m[INFO]: Building the project...\033[0m"
npm install
npm run build

# build docker images
# check if the environment is production
echo "\033[0;32m[INFO]: Building docker images...\033[0m"
if [ "$NODE_ENV" = "production" ]; then
  # build docker images
  docker compose --file prod.compose.yml up -d --build
else
  # build docker images
  docker compose --file dev.compose.yml up -d --build
fi

# await for the docker container to start
echo "\033[0;32m[INFO]: Waiting for the docker container to start...\033[0m"
while [ "$(docker inspect -f '{{.State.Running}}' boilerplate-api)" != "true" ]; do
  sleep 1
done
echo "\033[0;32m[INFO]: Docker container is up and running...\033[0m"

# migrate the database if the environment variable is set to true
if [ "$MIGRATE" = "true" ]; then
  # if the environment is production
  # run prisma deploy
  echo "\033[0;32m[INFO]: Migrating the database...\033[0m"
  if [ "$NODE_ENV" = "production" ]; then
    npx prisma migrate deploy
  elif [ "$MIGRATE_NAME" ]; then
    # if the environment is development
    # run prisma migrate dev with passed argument
    docker exec boilerplate-api npx prisma migrate dev --name $MIGRATE_NAME
  else
    # fallback to prisma migrate dev
    # this will run all the migrations
    docker exec boilerplate-api npx prisma migrate dev
  fi
fi

# follow the logs if the environment is development
if [ "$NODE_ENV" = "development" ]; then
  echo "\033[0;32m[INFO]: Following the logs...\033[0m"
  docker logs --tail 20 boilerplate-api --follow
fi