FROM node:20.11.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install esbuild@0.21.5
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
COPY . .
RUN npm run build-docker

FROM nginx:stable
COPY --from=build /app/dist/angular-frontend-project/browser /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
