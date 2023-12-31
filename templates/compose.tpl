version: "3.9"
services:
  nodejs:
    image: {{project_name}}/api
    container_name: {{project_name}}-api
    restart: always
    env_file:
      - .env
    ports:
      - ${PORT}:${PORT}
    volumes:
      - ./:/app
      - ./dist:/app/dist
      - /app/node_modules
    build:
      context: .
      dockerfile: ./docker/dev.dockerfile
      args:
        - NODE_ENV={{project_environment}}
        - PORT=${PORT}
    depends_on:
      - database
      - redis
  # Database
  database:
    image: postgres:15-alpine
    container_name: {{project_name}}-database
    restart: always
    ports:
      - ${POSTGRES_PORT}:5432
    expose:
      - ${POSTGRES_PORT}
    env_file:
      - ./docker/database/.env.database.dev
    volumes:
      - ./docker/database/docker-entrypoint-initdb/init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./docker/database/data:/var/lib/postgresql/data
  adminer:
    image: adminer
    container_name: {{project_name}}-adminer
    restart: always
    ports:
      - 8080:8080
    links:
      - database
  redis:
    image: redis
    container_name: {{project_name}}-redis
    restart: always
    ports:
      - 6379:6379
    volumes:
      - ./data/redis:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
  stripe:
    image: stripe/stripe-cli
    container_name: {{project_name}}-stripe
    restart: always
    volumes:
      - ./docker/stripe:/root/.config/configstore/stripe.yaml
    command: "listen --api-key ${STRIPE_SECRET_KEY} --forward-to http://host.docker.internal:{{stripe_port}}/payment/webhook"
networks:
  {{project_name}}-network:
    driver: bridge
