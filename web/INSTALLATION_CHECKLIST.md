# ✅ Installation Checklist

Use this checklist to verify your web app setup is complete and working.

## Pre-Installation
- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm or yarn available (`npm -v`)
- [ ] Located in the Rejuvena project directory

## Installation Steps
- [ ] Navigated to `web/` directory
- [ ] Ran `npm install` (or `./setup.sh`)
- [ ] Created `.env.local` file
- [ ] Updated `NEXT_PUBLIC_API_URL` in `.env.local`
- [ ] All dependencies installed without errors

## Verification Steps

### 1. Check Files Created
```bash
cd web
ls -la
```
Expected files:
- [ ] `package.json`
- [ ] `next.config.js`
- [ ] `tsconfig.json`
- [ ] `tailwind.config.js`
- [ ] `.env.local`
- [ ] `node_modules/` directory

### 2. Check Directory Structure
```bash
tree -L 2 src/
```
Expected directories:
- [ ] `src/api/`
- [ ] `src/store/`
- [ ] `src/pages/`
- [ ] `src/styles/`

### 3. Start Development Server
```bash
npm run dev
```
Expected output:
- [ ] No errors during compilation
- [ ] Server starts on http://localhost:3000
- [ ] "ready" message appears

### 4. Test Pages in Browser

Visit each page and verify:

**Landing Page** (http://localhost:3000)
- [ ] Page loads without errors
- [ ] Hero section displays
- [ ] Features grid shows 3 items
- [ ] Benefits section visible
- [ ] Navigation buttons work

**Login Page** (http://localhost:3000/auth/login)
- [ ] Page loads
- [ ] Email input field present
- [ ] Password input field present
- [ ] "Sign In" button visible
- [ ] Links to signup/forgot password work

**Signup Page** (http://localhost:3000/auth/signup)
- [ ] Page loads
- [ ] First name, last name, email fields present
- [ ] Terms checkbox present
- [ ] "Create Account" button visible
- [ ] Link to login works

### 5. Test Responsive Design

Open browser DevTools and test:
- [ ] Mobile view (375px)
- [ ] Tablet view (768px)
- [ ] Desktop view (1280px+)

### 6. Check Console

Open browser DevTools console:
- [ ] No critical errors (red)
- [ ] No CORS errors
- [ ] No missing file errors

### 7. Test Navigation

Try navigating:
- [ ] Landing → Login → Landing
- [ ] Landing → Signup → Login
- [ ] Browser back/forward buttons work

## Common Issues & Solutions

### ❌ Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### ❌ Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ TypeScript errors
Wait for `npm install` to complete, then restart dev server

### ❌ Tailwind styles not loading
```bash
npm run dev
```
Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

### ❌ API connection errors
Check `.env.local`:
- Verify `NEXT_PUBLIC_API_URL` is set
- Ensure no trailing slash
- Check API server is accessible

## API Integration Test

### Manual API Test (Optional)

1. **Test Login Endpoint:**
```bash
curl -X POST https://api.faceliftnaturally.me/api/token/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test","grant_type":"password"}'
```

2. **Expected Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  ...
}
```

### Test in Web App

1. Go to login page
2. Enter credentials
3. Open DevTools Network tab
4. Submit form
5. Check:
   - [ ] Request to `/api/token/auth` appears
   - [ ] Request includes correct headers
   - [ ] Response received (success or error)

## Performance Check

### Development Build
```bash
npm run dev
```
- [ ] Initial load < 3 seconds
- [ ] Page navigation instant

### Production Build
```bash
npm run build
npm start
```
- [ ] Build completes without errors
- [ ] Bundle size reasonable (<500KB initial)
- [ ] Pages load fast

## TypeScript Check
```bash
npm run type-check
```
- [ ] No type errors (some warnings OK)

## Linting Check
```bash
npm run lint
```
- [ ] No critical linting errors

## Final Verification

All green? You're ready to develop! ✅

### Next Steps:
1. ✅ Basic setup complete
2. ⏭️ Implement remaining pages (dashboard, courses, etc.)
3. ⏭️ Add social authentication
4. ⏭️ Integrate payment system
5. ⏭️ Deploy to production

## Need Help?

If any checks fail:
1. Review error messages carefully
2. Check `web/README.md` for detailed docs
3. Verify `.env.local` configuration
4. Ensure API server is accessible
5. Try fresh install: `rm -rf node_modules && npm install`

---

**Status:** [ ] Setup Complete and Verified

Date: _____________

Notes: _____________________________________________________________
