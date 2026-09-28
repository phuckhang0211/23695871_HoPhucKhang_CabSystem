FROM node:22-alpine
WORKDIR /app
COPY services/driver-assignment-service/package*.json ./
RUN npm ci --omit=dev
COPY services/driver-assignment-service/src ./services/driver-assignment-service/src
COPY services/shared ./services/shared
CMD ["node", "services/driver-assignment-service/src/app.js"]
