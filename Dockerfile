FROM httpd:latest

COPY ./assets/* /usr/local/apache2/htdocs/
