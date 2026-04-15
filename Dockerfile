FROM node:18

WORKDIR /app

# Copy ALL project files (IMPORTANT)
COPY . .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "app.js"]
