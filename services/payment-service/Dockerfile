FROM node:22-alpine
WORKDIR /app
COPY services/payment-service/package*.json ./
RUN npm ci --omit=dev
COPY services/payment-service/src ./services/payment-service/src
COPY services/shared ./services/shared
CMD ["node", "services/payment-service/src/app.js"]
