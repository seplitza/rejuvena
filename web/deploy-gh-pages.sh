#!/bin/bash

echo "🚀 Deploying to GitHub Pages..."
echo ""

# Check if we're in the web directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the web/ directory"
    exit 1
fi

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Build and deploy
echo "🔨 Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "📤 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Your site will be available at:"
    echo "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/"
    echo ""
    echo "Note: It may take a few minutes for changes to appear."
else
    echo "❌ Deployment failed"
    exit 1
fi
