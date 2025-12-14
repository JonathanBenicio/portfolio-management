FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for SSL certs
RUN mkdir -p /etc/nginx/certs

# Expose ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
