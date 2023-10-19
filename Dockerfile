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

# Установка глобального пакета serve для запуска статического сервера
RUN npm install -g serve

# Установка команды запуска сервера приложения
CMD ["serve", "-s", "build"]