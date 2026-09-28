FROM node:22-alpine
WORKDIR /app
COPY api-gateway/package*.json ./
RUN npm ci --omit=dev
COPY api-gateway/src ./src
COPY document ./document
CMD ["node", "src/app.js"]
