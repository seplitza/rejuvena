# 📌 GitHub Pages - Quick Reference

## 🚀 Quick Deploy (3 Steps)

### 1. Setup Git (First Time Only)
```bash
cd /Users/alexeipinaev/Documents/Rejuvena
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seplitza/rejuvena.git
git push -u origin main
```

### 2. Configure on GitHub
1. Go to: **https://github.com/seplitza/rejuvena/settings/pages**
2. Source: **GitHub Actions**
3. Go to: **https://github.com/seplitza/rejuvena/settings/secrets/actions**
4. Add secret: `NEXT_PUBLIC_API_URL` = `https://bm-services.azurewebsites.net`

### 3. Deploy
```bash
git push  # Automatic deployment via GitHub Actions
```

**OR** manually:
```bash
cd web
./deploy-gh-pages.sh
```

---

## 🌐 Your Site URL

```
https://seplitza.github.io/rejuvena/
```

---

## 📝 Important Configuration

### Update Repository Name (if different)

Edit `web/next.config.js` line 4-5:
```javascript
basePath: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME' : '',
```

---

## 🔄 Update Site

### Automatic (GitHub Actions)
```bash
git add .
git commit -m "Update"
git push
```
Wait 2-3 minutes for deployment.

### Manual (gh-pages)
```bash
cd web
./deploy-gh-pages.sh
```

---

## ✅ What Works on GitHub Pages

✅ Static pages
✅ Client-side rendering
✅ API calls to external backend
✅ Redux state
✅ Authentication
✅ Responsive design

---

## ❌ What Doesn't Work

❌ Server-side rendering (SSR)
❌ Next.js API routes
❌ Dynamic imports (some cases)

---

## 🐛 Common Issues

### Pages show 404
→ Check `basePath` in `next.config.js`

### CSS not loading
→ Run `touch web/out/.nojekyll` before deploy

### API calls fail
→ Check CORS on backend allows GitHub Pages domain

---

## 📊 Deployment Methods

| Method | Command | Auto | Best For |
|--------|---------|------|----------|
| **GitHub Actions** | `git push` | ✅ | Production |
| **gh-pages CLI** | `./deploy-gh-pages.sh` | ❌ | Testing |

---

## 🔧 Files Modified for GitHub Pages

1. `web/next.config.js` - Added static export
2. `web/package.json` - Added deploy scripts
3. `.github/workflows/deploy.yml` - CI/CD workflow
4. `web/deploy-gh-pages.sh` - Manual deploy script

---

## 📞 Support

- **GitHub Actions**: Check "Actions" tab
- **Manual Deploy**: Check terminal output
- **Site Issues**: Check browser console

---

**Ready to deploy!** Run `git push` or `./deploy-gh-pages.sh` 🚀
