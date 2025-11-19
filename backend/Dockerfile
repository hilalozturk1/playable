FROM node:18-alpine

WORKDIR /usr/src/app

# Install app dependencies (including dev for TypeScript build)
COPY package*.json ./
RUN npm install --production=false

# Copy source
COPY tsconfig.json ./
COPY src ./src

# Build
RUN npm run build

# Remove dev dependencies to slim image
RUN npm prune --production

ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]
