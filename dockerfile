
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY foodpantry-1a506-firebase-adminsdk-vqspz-c70a3db5ac.json ./

COPY . .

EXPOSE 3000

CMD ["npm", "test"]
