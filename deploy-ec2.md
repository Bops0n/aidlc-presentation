# Deploy to AWS EC2

## Prerequisites
- EC2 instance (Ubuntu 22.04 recommended, t3.medium+)
- Docker + Docker Compose installed
- Security group: ports 80, 443, 3000 open
- (Optional) Domain name + SSL certificate

## Step 1: SSH into EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## Step 2: Install Docker (if not installed)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
# Logout and login again
docker compose version  # verify
```

## Step 3: Clone or copy project to EC2

```bash
git clone your-repo-url /app/presentation-builder
cd /app/presentation-builder
```

Or SCP from local:
```bash
scp -i your-key.pem -r . ubuntu@your-ec2-ip:/app/presentation-builder/
```

## Step 4: Create .env file

```bash
cp .env.production .env
nano .env
# Fill in real values:
# - DB_PASSWORD (strong password)
# - NEXTAUTH_SECRET (run: openssl rand -base64 32)
# - NEXTAUTH_URL (https://your-domain.com)
# - AWS_BEARER_TOKEN_BEDROCK (from Bedrock Console)
```

## Step 5: Build and run

```bash
docker compose up -d --build
```

This will:
1. Start PostgreSQL container
2. Run `prisma/init.sql` to create all tables (auto on first start)
3. Build the Next.js app
4. Start the app on port 3000

## Step 6: Verify

```bash
# Check containers running
docker compose ps

# Check logs
docker compose logs app -f

# Test
curl http://localhost:3000
```

## Step 7: (Optional) Setup Nginx reverse proxy + SSL

```bash
sudo apt install nginx certbot python3-certbot-nginx -y

# Create nginx config
sudo nano /etc/nginx/sites-available/presentation
```

```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/presentation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL cert (needs domain pointed to EC2 IP)
sudo certbot --nginx -d your-domain.com
```

## Maintenance

```bash
# Update app
cd /app/presentation-builder
git pull
docker compose up -d --build

# View logs
docker compose logs app -f

# Restart
docker compose restart app

# Backup database
docker compose exec db pg_dump -U postgres presentation_builder > backup.sql
```

## Architecture on EC2

```
EC2 Instance (t3.medium)
├── Docker
│   ├── PostgreSQL 16 (port 5432, internal only)
│   │   └── Volume: postgres_data
│   └── Next.js App (port 3000)
│       └── Volume: uploads_data (/app/public/uploads)
├── Nginx (port 80/443) → proxy → :3000
└── Certbot (SSL auto-renew)
```
