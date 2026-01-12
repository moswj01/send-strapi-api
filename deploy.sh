#!/bin/bash

# Ubuntu Deployment Script for Strapi v5
# This script sets up and deploys the Strapi application on Ubuntu

set -e

echo "🚀 Starting Strapi deployment to Ubuntu..."

# Configuration
APP_NAME="send-strapi-api"
DEPLOY_PATH="/var/www/$APP_NAME"
REPO_URL="your-git-repo-url"  # Update this with your Git repository URL
NODE_VERSION="24.12.0"

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js using nvm if not already installed
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js v$NODE_VERSION..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
else
    echo "✅ Node.js already installed: $(node -v)"
fi

# Install PM2 globally
echo "📥 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📥 Installing Nginx..."
sudo apt install -y nginx

# Create deployment directory
echo "📁 Creating deployment directory..."
sudo mkdir -p $DEPLOY_PATH
sudo chown -R $USER:$USER $DEPLOY_PATH

# Deploy application
echo "📂 Deploying application files..."
# Option 1: If using Git
# git clone $REPO_URL $DEPLOY_PATH
# cd $DEPLOY_PATH

# Option 2: If copying from local (run this from your local machine instead)
# rsync -avz --exclude 'node_modules' --exclude '.git' ./ user@server:$DEPLOY_PATH/

# Install dependencies
echo "📦 Installing dependencies..."
cd $DEPLOY_PATH
npm ci --only=production

# Build application
echo "🔨 Building application..."
npm run build

# Configure PM2
echo "⚙️  Configuring PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "⚙️  Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;  # Update with your domain

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo "✅ Deployment complete!"
echo "📝 Next steps:"
echo "1. Update your .env file in $DEPLOY_PATH with production values"
echo "2. Update the domain in /etc/nginx/sites-available/$APP_NAME"
echo "3. Install SSL certificate with: sudo certbot --nginx -d your-domain.com"
echo "4. Restart services: pm2 restart $APP_NAME && sudo systemctl restart nginx"
