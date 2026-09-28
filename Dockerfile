FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY services ./services
COPY src ./src
ARG SERVICE_PATH
ENV SERVICE_PATH=$SERVICE_PATH
CMD node $SERVICE_PATH
