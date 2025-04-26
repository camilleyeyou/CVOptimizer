FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build frontend
RUN cd frontend && npm install && npm run build

# Expose port
EXPOSE 5000

# Command to run the app
CMD ["npm", "start"]