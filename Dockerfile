# Builds the Storybook component showcase and serves it as a static site.
# KrabeUI itself is a library (no server) — this image only packages the
# Storybook build (`npm run build-storybook`) behind nginx so it can be
# deployed/browsed like a normal web app.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build-storybook

FROM nginx:1.27-alpine
COPY --from=build /app/storybook-static /usr/share/nginx/html
EXPOSE 80
