FROM 192.168.8.14/library/nginx:1.28.0-alpine3.21-slim

ENV LANG=zh_CN.UTF-8 \
    TZ=Asia/Shanghai
RUN mkdir -p /var/www

COPY apps/web-ele/dist/ /var/www/dist/

COPY apps/web-ele/nginx/default.conf /etc/nginx/conf.d/default.conf
