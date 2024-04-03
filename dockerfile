# Use Nginx as base image
FROM nginx

# Copy HTML files for each website to Nginx web root directory
COPY ./website1/index.html /usr/share/nginx/html/website1/
COPY ./website2/index.html /usr/share/nginx/html/website2/
COPY ./website3/index.html /usr/share/nginx/html/website3/

# Copy Nginx configuration files
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
