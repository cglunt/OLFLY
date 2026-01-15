FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build if you have a build step
# (if this fails, we can adjust)
RUN npm run build || echo "No build step, skipping"

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start your server
CMD ["npm", "run", "start"]
