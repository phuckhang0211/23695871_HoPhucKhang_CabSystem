FROM node:22-alpine
WORKDIR /app
COPY services/rating-service/package*.json ./
RUN npm ci --omit=dev
COPY services/rating-service/src ./services/rating-service/src
COPY services/shared ./services/shared
CMD ["node", "services/rating-service/src/app.js"]
