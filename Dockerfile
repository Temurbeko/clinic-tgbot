FROM node:22

# Install necessary tools and Puppeteer dependencies
RUN apt-get update && \
    apt-get install -y \
      postgresql-client \
      dos2unix \
      libnss3 \
      libdbus-1-3 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libcups2 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      xdg-utils \
      libasound2 \
      libgbm1 \
      libgconf-2-4 \
      libgtk-3-0 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependencies and install
COPY package.json package-lock.json ./
RUN npm install

# Copy all files (make sure your public folder and assets are included)
COPY . .

# Fix entrypoint script permissions
RUN dos2unix /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
