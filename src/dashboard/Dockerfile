FROM node:20.15 AS builder

WORKDIR /usr/src/app/
USER root
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.15.12
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY baas-admin.conf /etc/nginx/conf.d/

EXPOSE 8081

CMD ["bash", "-c", "nginx -g 'daemon off;'"]
