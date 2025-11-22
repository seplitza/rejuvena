# 🚀 GitHub Pages Deployment Guide

This guide will help you deploy the FaceLift Naturally web app to GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed locally
- Repository on GitHub

## 🔧 Setup Steps

### 1. Update Repository Name in Config

If your GitHub repository is NOT named "Rejuvena", update `web/next.config.js`:

```javascript
basePath: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME' : '',
```

Replace `YOUR-REPO-NAME` with your actual repository name.

### 2. Initialize Git Repository (if not already)

```bash
cd /Users/alexeipinaev/Documents/Rejuvena
git init
git add .
git commit -m "Initial commit with web app"
```

### 3. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "Rejuvena")
3. **Do NOT** initialize with README, .gitignore, or license

### 4. Push to GitHub

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### 5. Configure GitHub Pages

#### Option A: Using GitHub Actions (Recommended)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. Go to **Settings** → **Secrets and variables** → **Actions**
5. Click **New repository secret**
6. Add secret:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://api.faceliftnaturally.me`
7. Push any change to trigger deployment:
   ```bash
   git push
   ```

Your site will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

#### Option B: Manual Deployment with gh-pages

1. Install dependencies:
   ```bash
   cd web
   npm install
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

3. Go to repository **Settings** → **Pages**
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **(root)**
5. Click **Save**

Wait a few minutes, then visit:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## 🔑 Environment Variables

Add these secrets in GitHub:
- `NEXT_PUBLIC_API_URL` - Your API endpoint

To add secrets:
1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each variable

## 🧪 Testing Locally Before Deploy

Test the production build locally:

```bash
cd web
npm run build
npm start
```

Visit http://localhost:3000 and verify everything works.

## 📦 Build Output

The GitHub Pages deployment will:
1. Build Next.js app as static HTML/CSS/JS
2. Export to `out/` directory
3. Deploy to `gh-pages` branch
4. Serve at your GitHub Pages URL

## ⚙️ Deployment Options Compared

| Method | Pros | Cons |
|--------|------|------|
| **GitHub Actions** | Automatic on push, CI/CD | Requires setup |
| **gh-pages CLI** | Simple, manual control | Manual deploys |

## 🔄 Update Deployment

### With GitHub Actions
Just push changes:
```bash
git add .
git commit -m "Update web app"
git push
```

### With gh-pages CLI
```bash
cd web
npm run deploy
```

## 🐛 Troubleshooting

### Issue: 404 on GitHub Pages
**Solution**: Check basePath in `next.config.js` matches your repo name

### Issue: CSS not loading
**Solution**: Ensure `.nojekyll` file exists in output:
```bash
touch web/out/.nojekyll
```

### Issue: Images not displaying
**Solution**: Use relative paths or full URLs for images

### Issue: API calls failing
**Solution**: Check CORS settings on your API server to allow your GitHub Pages domain

### Issue: Routing not working
**Solution**: GitHub Pages doesn't support SPA routing. Use hash routing or create custom 404.html

## 📝 Important Notes

### Limitations of GitHub Pages

1. **Static Only**: No server-side rendering (SSR)
2. **No API Routes**: Next.js API routes won't work
3. **SPA Routing**: May need hash routing for client-side routing
4. **HTTPS Only**: Always served over HTTPS

### What Works

✅ Static pages (landing, login, signup)
✅ Client-side rendering
✅ API calls to external backend
✅ Redux state management
✅ Authentication (with external API)

### What Doesn't Work

❌ Server-side rendering (SSR)
❌ Next.js API routes
❌ Dynamic routes (without workaround)
❌ Incremental Static Regeneration (ISR)

## 🎯 Alternative: Full Next.js Hosting

If you need SSR and API routes, consider:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**

These support full Next.js features.

## 🔗 Custom Domain (Optional)

To use a custom domain with GitHub Pages:

1. Go to **Settings** → **Pages**
2. Enter your custom domain
3. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: YOUR-USERNAME.github.io
   ```
4. Wait for DNS propagation (up to 24 hours)

## 📊 Monitoring Deployments

### GitHub Actions
- Go to **Actions** tab to see deployment status
- Click on any workflow run for details

### gh-pages Branch
- Check `gh-pages` branch for deployed files
- Commits show deployment history

## ✅ Verification Checklist

After deployment:
- [ ] Visit your GitHub Pages URL
- [ ] Test all pages load correctly
- [ ] Verify CSS and styling work
- [ ] Test navigation between pages
- [ ] Try API calls (login/signup)
- [ ] Check browser console for errors
- [ ] Test on mobile device

## 🎉 Success!

Your web app should now be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

Example: `https://alexeipinaev.github.io/Rejuvena/`

---

**Need help?** Check GitHub Actions logs or repository Issues.
