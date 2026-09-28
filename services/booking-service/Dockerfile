FROM node:22-alpine
WORKDIR /app
COPY services/booking-service/package*.json ./
RUN npm ci --omit=dev
COPY services/booking-service/src ./services/booking-service/src
COPY services/shared ./services/shared
CMD ["node", "services/booking-service/src/app.js"]
