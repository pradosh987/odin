```
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
```

Install Caddyserver for local development

```
brew install caddy
caddy start
```

## Nginx conf
```
server {
    listen 80;
    server_name api.digthemes.com;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         http://127.0.0.1:4000;
    }
}


server {
    listen 80;
    server_name cdn.digthemes.com;
    root /home/ubuntu/odin/storage;
}
```