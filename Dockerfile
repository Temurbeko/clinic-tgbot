# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:dev"]
