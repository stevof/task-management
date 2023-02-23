FROM postgres:alpine3.17
COPY ./server/database.sql /docker-entrypoint-initdb.d/