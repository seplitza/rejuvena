# 🚀 Quick Start Guide - FaceLift Naturally Web App

## Prerequisites
- Node.js 18 or higher
- npm or yarn

## Step 1: Setup (30 seconds)

```bash
cd web
./setup.sh
```

Or manually:
```bash
cd web
npm install
cp .env.local.example .env.local
```

## Step 2: Configure Environment

Edit `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.faceliftnaturally.me
NEXT_PUBLIC_ENV=development
```

## Step 3: Run Development Server

```bash
npm run dev
```

## Step 4: Open Browser

Visit: **http://localhost:3000**

---

## 🎯 Available Pages

- `/` - Landing page
- `/auth/login` - Sign in
- `/auth/signup` - Create account

## 🔑 Test Credentials

Use your existing mobile app credentials or create a new account.

## 🛠️ Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

## 📝 What's Working

✅ Landing page with features
✅ Login form
✅ Signup form
✅ API integration
✅ Redux state management
✅ Authentication flow
✅ Responsive design

## 🔨 What Needs Implementation

⚠️ Social login (Google/Facebook) - OAuth setup needed
⚠️ Dashboard pages - Coming next
⚠️ Course/Exercise pages - Coming next
⚠️ Photo diary - Coming next
⚠️ Payment integration - Coming next

## 🐛 Troubleshooting

### Port already in use
```bash
# Change port
npm run dev -- -p 3001
```

### Dependencies issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
These are normal before running `npm install`

## 📚 Need Help?

Check the full documentation in `web/README.md`

---

**Ready to develop? Start with `npm run dev`!** 🎉
