FROM alpine:3.21 AS builder

COPY ./assets/ /src/

# Generate a content hash from all assets and inject it into asset URLs
RUN apk add --no-cache coreutils && \
    SHA=$(find /src -type f -exec sha256sum {} + | sort | sha256sum | cut -c1-8) && \
    sed -i "s|style.css|style.css?v=$SHA|g; s|script.js|script.js?v=$SHA|g" /src/index.html

FROM nginx:alpine

COPY --from=builder /src/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
