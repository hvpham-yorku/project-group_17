# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.4.0
FROM node:${NODE_VERSION}-slim

LABEL fly_launch_runtime="Next.js"
ENV NEXT_PRIVATE_STANDALONE true
WORKDIR /app

# Set development environment
ENV NODE_ENV="development"

# Install node modules
COPY package-lock.json package.json ./
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Expose the port and start the server
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
