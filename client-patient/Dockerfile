FROM node:10

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
#CMD ["npm", "run", "dev"]
CMD ["npm","start"]