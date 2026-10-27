FROM postgres:17-alpine
RUN apk add --no-cache age
COPY deploy/backup-postgres.sh /usr/local/bin/backup-postgres
ENTRYPOINT ["/usr/local/bin/backup-postgres"]
