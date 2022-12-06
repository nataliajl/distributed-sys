# build environment
FROM node:16.14.0

RUN apt-get update -y && apt-get upgrade -y
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]

# Install npm production packages 
RUN npm install --omit=dev
COPY . .
CMD ["npm", "start"]
