#! /bin/bash

# Скрипт для сборки продакшн версии сайта

# Название директории, в которую будет помещена сборка
DIR="bundle"

mkdir temp-files
cp $DIR/server/static/* ./temp-files/
rm -rf $DIR
mkdir $DIR
mkdir $DIR/build
cp -r build/* $DIR/build
mkdir $DIR/server
mkdir $DIR/server/static
mv ./temp-files/* $DIR/server/static/
rm -rf ./temp-files
cp -r server/build/* $DIR/server
cp -r static/* $DIR/build/client
cp package.json $DIR
cp .env $DIR
echo "✅ Production version is ready in $DIR directory"