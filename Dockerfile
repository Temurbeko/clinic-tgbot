# Use Node.js 22 as base image
FROM node:22-alpine AS builder
WORKDIR /app
# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install
# Copy the rest of the source code and build the project
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production
# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
