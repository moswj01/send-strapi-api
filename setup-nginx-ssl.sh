#!/bin/bash

# Nginx and SSL Setup Script for Strapi on Ubuntu
# Run this on your Ubuntu server: bash setup-nginx-ssl.sh

set -e

echo "🚀 Setting up Nginx and SSL for Strapi..."

# Configuration
DOMAIN="your-domain.com"  # ⚠️ CHANGE THIS to your actual domain
EMAIL="your-email@example.com"  # ⚠️ CHANGE THIS to your email
APP_PORT=1337

echo "📦 Installing Nginx and Certbot..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

echo "⚙️  Configuring Nginx..."
sudo tee /etc/nginx/sites-available/send-strapi-api > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://72.60.107.67:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
echo "🔗 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/send-strapi-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "✅ Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Install SSL certificate
echo "🔐 Installing SSL certificate..."
sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m ${EMAIL} --redirect

# Setup auto-renewal
echo "⏰ Setting up SSL auto-renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo ""
echo "✅ ✅ ✅  Setup Complete! ✅ ✅ ✅"
echo ""
echo "📋 Summary:"
echo "  - Nginx is configured and running"
echo "  - SSL certificate installed for ${DOMAIN}"
echo "  - Firewall configured (ports 80, 443, 22)"
echo "  - Auto-renewal enabled for SSL"
echo ""
echo "🌐 Your Strapi app is now available at:"
echo "   https://${DOMAIN}"
echo ""
echo "📝 Useful commands:"
echo "   - Check Nginx status: sudo systemctl status nginx"
echo "   - Check SSL: sudo certbot certificates"
echo "   - Renew SSL manually: sudo certbot renew"
echo "   - View Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
