FROM node:22-alpine
WORKDIR /app
COPY services/notification-service/package*.json ./
RUN npm ci --omit=dev
COPY services/notification-service/src ./services/notification-service/src
COPY services/shared ./services/shared
CMD ["node", "services/notification-service/src/app.js"]
