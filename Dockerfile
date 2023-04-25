# production stage
FROM nginx:1.19-alpine as prod
COPY ./dist/spa /usr/share/nginx/html
