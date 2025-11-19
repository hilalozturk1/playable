FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production=false

# Accept build arg to bake API URL into the build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy everything
COPY . .

# Build the Next.js app
RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
