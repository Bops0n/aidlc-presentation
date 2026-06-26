# Deployment Guide — Presentation Builder v1.0 (AWS EC2)

## Prerequisites

- AWS Account พร้อม EC2 access
- Key pair (.pem) สำหรับ SSH
- Domain name (optional, สำหรับ HTTPS)
- AWS credentials สำหรับ Amazon Bedrock

---

## 1. Launch EC2 Instance

### Recommended Specs

| Setting | Value |
|---------|-------|
| AMI | Amazon Linux 2023 |
| Instance type | t3.small (2 vCPU, 2GB RAM) ขั้นต่ำ |
| Storage | 20GB gp3 |
| Security Group | SSH (22), HTTP (80), HTTPS (443) |

### Security Group Rules

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | Your IP |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

### IAM Role (แนะนำ แทนการใช้ API key)

สร้าง IAM Role สำหรับ EC2 แล้ว attach policy:
- `AmazonBedrockFullAccess` (หรือ scoped policy เฉพาะ `bedrock:InvokeModel`)

Attach role ตอน launch instance → ไม่ต้องใส่ AWS credentials ใน .env

---

## 2. SSH เข้า EC2

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>
```

---

## 3. Install Docker + Docker Compose

```bash
# Update system
sudo dnf update -y

# Install Docker
sudo dnf install docker -y
sudo systemctl enable docker
sudo systemctl start docker

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user

# Install Docker Compose plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Logout & login again to apply group
exit
```

SSH กลับเข้ามาอีกครั้ง แล้วเช็ค:

```bash
docker --version
docker compose version
```

---

## 4. Clone & Configure

```bash
# Install git
sudo dnf install git -y

# Clone repo
git clone <your-repo-url> /home/ec2-user/presentation-builder
cd /home/ec2-user/presentation-builder

# Create .env from template
cp .env.production .env
```

### แก้ไข `.env`

```bash
nano .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_PASSWORD` | PostgreSQL password (strong) | `MyStr0ng!Pass#2025` |
| `NEXTAUTH_SECRET` | Random 32+ chars | ใช้ `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `http://<EC2_PUBLIC_IP>` หรือ `https://slides.example.com` |
| `AWS_BEARER_TOKEN_BEDROCK` | Bedrock API key (ถ้าไม่ใช้ IAM Role) | `sk-...` |
| `AWS_REGION` | Region ที่ enable Bedrock | `us-east-1` |
| `BEDROCK_MODEL_ID` | Model ID | `us.amazon.nova-pro-v1:0` |
| `UNSPLASH_ACCESS_KEY` | (optional) Unsplash key | |

> ถ้า attach IAM Role แล้ว สามารถลบ `AWS_BEARER_TOKEN_BEDROCK` ออกได้

---

## 5. Build & Start

```bash
docker compose up -d --build
```

รอ build ~2-3 นาที (ครั้งแรก) จากนั้น app จะรันที่ port 80

### ตรวจสอบ

```bash
# Status
docker compose ps

# Logs
docker compose logs app --tail 50

# Test
curl http://localhost/api/presentations
```

---

## 6. Database Migration

init.sql จะรันอัตโนมัติตอน first start (mounted เข้า postgres initdb)

ถ้าต้อง run Prisma migrations:

```bash
docker compose exec app npx prisma migrate deploy
```

---

## 7. HTTPS Setup (Production)

### Option A: Nginx + Let's Encrypt (บน EC2 โดยตรง)

```bash
# Install nginx + certbot
sudo dnf install nginx -y
sudo dnf install certbot python3-certbot-nginx -y

# Start nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

สร้างไฟล์ `/etc/nginx/conf.d/presentation-builder.conf`:

```nginx
server {
    server_name slides.example.com;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> เปลี่ยน docker-compose app port เป็น `3000:3000` เพื่อไม่ชนกับ nginx port 80

```bash
# Get SSL certificate
sudo certbot --nginx -d slides.example.com

# Auto-renew
sudo systemctl enable certbot-renew.timer
```

### Option B: AWS ALB + ACM

- สร้าง Application Load Balancer
- ใช้ AWS Certificate Manager (ACM) ออก SSL ฟรี
- Target Group ชี้ไปที่ EC2 port 80
- ALB listener: 443 (HTTPS) → forward to target group

### Option C: Cloudflare (ง่ายสุด)

- ชี้ domain ไปที่ EC2 IP ผ่าน Cloudflare
- เปิด Proxy mode → ได้ SSL อัตโนมัติ
- ไม่ต้องตั้ง cert บน EC2

---

## 8. Auto-restart on Reboot

Docker service จะ start อัตโนมัติ (systemctl enable docker) และ container มี `restart: unless-stopped` อยู่แล้ว

---

## Operations

### Update / Redeploy

```bash
cd /home/ec2-user/presentation-builder
git pull
docker compose up -d --build
```

### View Logs

```bash
# App
docker compose logs -f app

# Database
docker compose logs -f db

# All
docker compose logs -f
```

### Resource Monitoring

```bash
docker stats
htop
```

### Backup Database

```bash
docker compose exec db pg_dump -U postgres presentation_builder > ~/backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
docker compose exec -T db psql -U postgres presentation_builder < ~/backup_20250626.sql
```

---

## Architecture on EC2

```
┌─────────────────────────────────────────────────────┐
│                    EC2 Instance                       │
│                  (t3.small / AL2023)                  │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐   │
│  │            Docker Compose                     │   │
│  ├───────────────────┬──────────────────────────┤   │
│  │   app (port 80)   │   db (port 5432)         │   │
│  │   Next.js         │   PostgreSQL 16          │   │
│  │   standalone      │   pgdata volume          │   │
│  └───────────────────┴──────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  (Optional) Nginx reverse proxy → HTTPS (443)        │
└─────────────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────┐
  │ Amazon       │
  │ Bedrock      │
  │ (us-east-1)  │
  └──────────────┘
```

---

## Cost Estimate (Monthly)

| Resource | Spec | ~Cost |
|----------|------|-------|
| EC2 t3.small | 2 vCPU, 2GB | ~$15/mo |
| EBS 20GB gp3 | Storage | ~$2/mo |
| Data transfer | ~50GB out | ~$5/mo |
| **Total** | | **~$22/mo** |

> ใช้ Reserved Instance หรือ Savings Plan ลดได้ ~30-40%

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 80 ไม่เปิด | เช็ค Security Group → allow inbound HTTP |
| DB connection refused | `docker compose logs db` ดู error, เช็ค DB_PASSWORD |
| Bedrock 403 | เช็ค IAM Role/credentials, region ตรงกับ model |
| Out of memory | Upgrade เป็น t3.medium (4GB) |
| Build fail | `docker compose build --no-cache` |

---

## Features Included (v1.0)

- ✅ Authentication (NextAuth.js — credentials)
- ✅ Presentation CRUD + PostgreSQL persistence
- ✅ Interactive Canvas Editor (960×540)
- ✅ Templates & Themes (25+ templates, 30+ layouts)
- ✅ Data Visualization (6 chart types)
- ✅ Image Upload & Unsplash
- ✅ AI Slide Generation (Amazon Bedrock)
- ✅ PDF Export
- ✅ Presenter Mode (fullscreen, transitions, laser pointer, notes)

## Deferred (v2.0)

- ⏸ Real-time Collaboration (WebSocket/CRDT)
- ⏸ PPTX Export
