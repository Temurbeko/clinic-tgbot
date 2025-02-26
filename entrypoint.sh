#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
until pg_isready -h postgres -p 5432; do
  sleep 2
done
echo "PostgreSQL is up - executing commands"

npx prisma generate
npx prisma migrate deploy

echo "Starting NestJS application..."
exec npm run start:dev
