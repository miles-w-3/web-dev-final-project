# Dockerfile for running backend
FROM node:18.18.2-buster-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ /usr/src/app
WORKDIR /usr/src/app/backend
RUN npm install && npm run prestart
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "npx", "ts-node", "src/index.ts" ]