FROM node:22-alpine as build

RUN mkdir /project
WORKDIR /project

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build



FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html
COPY --from=build /project/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /project/dist/fhir-client/browser /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
