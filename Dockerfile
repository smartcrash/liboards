FROM node:14-alpine

WORKDIR /usr/src/app

# Add packaje.json file
COPY package.json ./

# Install dependiencies
RUN npm install --only=production

# Copy source code
COPY source ./source
COPY tsconfig.json ./tsconfig.json

# Build production code
RUN npm run build

RUN ls -a

EXPOSE 4000

CMD ["node", "dist/main.js"]
