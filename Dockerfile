# 1. Use official Node.js image
FROM node:18-alpine

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Build the Next.js app
RUN npm run build

# 7. Expose application port
# EXPOSE 3000
EXPOSE 8080

# 8. Run the custom server
CMD ["node", "server.js"]

