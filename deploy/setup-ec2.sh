#!/bin/bash
# ============================================================
# EC2 Setup Script — Run once on a fresh Amazon Linux 2023 / Ubuntu
# Usage: ssh into EC2, then: bash setup-ec2.sh
# ============================================================

set -e

echo "=== Installing Docker ==="
# Amazon Linux 2023
if command -v dnf &> /dev/null; then
  sudo dnf update -y
  sudo dnf install -y docker git
  sudo systemctl enable docker
  sudo systemctl start docker
  sudo usermod -aG docker $USER
# Ubuntu
elif command -v apt &> /dev/null; then
  sudo apt update -y
  sudo apt install -y docker.io docker-compose-plugin git
  sudo systemctl enable docker
  sudo systemctl start docker
  sudo usermod -aG docker $USER
fi

echo "=== Installing Docker Compose ==="
DOCKER_COMPOSE_VERSION="v2.29.1"
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "=== Done! Log out and back in for docker group to take effect ==="
echo "Then: cd your-project && docker-compose --env-file .env.production up -d --build"
