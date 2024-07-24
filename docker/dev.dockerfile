FROM node:20 AS base
ENV NODE_ENV development
WORKDIR /app
COPY package*.json ./

FROM base AS dependencies
RUN npm ci

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM base
# Install pm2 globally
RUN npm install -g pm2
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE ${PORT:-3000}
USER node
CMD ["npm", "run", "start:local:dev"]