FROM node:8.5.0-wheezy
WORKDIR /app
COPY package*.json ./
RUN npm install --save bcrypt
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm" , "start"]
