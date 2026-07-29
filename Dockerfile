FROM httpd:latest AS builder

COPY ./assets/ /src/

# Generate a content hash from all assets and inject it into asset URLs
RUN SHA=$(find /src -type f -exec sha256sum {} + | sort | sha256sum | cut -c1-8) && \
    sed -i "s|style.css|style.css?v=$SHA|g; s|script.js|script.js?v=$SHA|g" /src/index.html

FROM httpd:latest

COPY --from=builder /src/ /usr/local/apache2/htdocs/
