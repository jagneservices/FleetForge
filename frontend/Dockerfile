FROM node:20-alpine

WORKDIR /app

# Install yarn deps first (better caching)
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile || yarn install

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
