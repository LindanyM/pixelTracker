FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY telemetry-agent.js .

CMD ["node", "telemetry-agent.js"]

