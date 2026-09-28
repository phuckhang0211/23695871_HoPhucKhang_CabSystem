FROM node:22-alpine
WORKDIR /app
COPY services/trip-service/package*.json ./
RUN npm ci --omit=dev
COPY services/trip-service/src ./services/trip-service/src
COPY services/shared ./services/shared
CMD ["node", "services/trip-service/src/app.js"]
