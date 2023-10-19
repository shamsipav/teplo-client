FROM node:14
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY svelte.config.js ./
COPY vite.config.ts ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000
ENV HOST=0.0.0.0
CMD [ "npm", "start" ]