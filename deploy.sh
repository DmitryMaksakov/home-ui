#!/bin/bash

rm -r production/
echo "Production folder was removed"

echo "Updating from sources..."
git pull
echo "Done"

echo "Installing npm packages..."
npm i
echo "Done"

echo "Creating package..."
webpack -p
echo "Done"

rm -r /var/www/html/*
echo "Nginx www folder files were removed"

cp -a production/. /var/www/html
echo "Package files were copied"

sudo systemctl restart nginx
echo "Nginx was restarted"
