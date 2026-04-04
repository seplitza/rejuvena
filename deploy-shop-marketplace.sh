#!/bin/bash
# Deploy marketplace badges to shop.seplitza.ru

set -e

SERVER="root@37.252.20.170"
TARGET_DIR="/var/www/shop"
SOURCE_DIR="/Users/alexeipinaev/Documents/Rejuvena/shop-frontend"

echo "📦 Deploying marketplace badges to shop..."

# Copy files using rsync (more reliable than scp)
echo "1️⃣ Copying shop.ts types..."
rsync -av "$SOURCE_DIR/src/types/shop.ts" "$SERVER:$TARGET_DIR/src/types/"

echo "2️⃣ Copying ProductCard.tsx..."
rsync -av "$SOURCE_DIR/src/components/products/ProductCard.tsx" "$SERVER:$TARGET_DIR/src/components/products/"

echo "3️⃣ Copying [slug].tsx..."
rsync -av "$SOURCE_DIR/src/pages/products/[slug].tsx" "$SERVER:$TARGET_DIR/src/pages/products/"

# Rebuild and restart
echo "4️⃣ Building shop on server..."
ssh $SERVER "cd $TARGET_DIR && npm run build"

echo "5️⃣ Restarting shop service..."
ssh $SERVER "systemctl restart seplitza-shop"

echo "✅ Deployment complete!"
echo "🌐 Check: https://shop.seplitza.ru/catalog"
