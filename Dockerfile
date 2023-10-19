# Установка базового образа Node.js
FROM node:14

# Создание директории приложения в контейнере
WORKDIR /app

# Копирование package.json и package-lock.json в контейнер
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода приложения в контейнер
COPY . .

# Сборка приложения
RUN npm run build

EXPOSE 5000
ENV HOST=0.0.0.0
CMD [ "npm", "start" ]