FROM node:19 as build
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY svelte.config.js ./
COPY vite.config.ts ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
ENV HOST=0.0.0.0
CMD [ "node", "build" ]

FROM nginx
COPY --from=build /app/public /usr/share/nginx/html
# COPY ./.nginx/nginx.conf /etc/nginx/conf.d/default.conf