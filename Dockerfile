# /backend/Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install -g pm2 && npm install

# Copy the rest of the application code to the container
COPY . .


# Expose the port the app runs on
EXPOSE 3000

# Start the app using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
