# FaceLift Naturally - Web Application

A dedicated web application for FaceLift Naturally, ported from the React Native mobile app with reused API layer and business logic.

## 🚀 Features

- **Authentication System**: Email/password, Google, Facebook, and Apple sign-in
- **User Dashboard**: Access to courses, exercises, and personal progress
- **Photo Diary**: Track your rejuvenation journey with before/after photos
- **Exercise Library**: Video tutorials and guided face exercises
- **Guest Mode**: Try the app without creating an account
- **Responsive Design**: Works on desktop, tablet, and mobile browsers

## 🏗️ Architecture

This web app reuses the following from the mobile app:
- ✅ **API Layer** (`app/api/`) - Complete REST API integration
- ✅ **Business Logic** - Redux store, reducers, and sagas
- ✅ **Data Models** - User, course, exercise, and photo diary structures
- ✅ **Translations** - Multi-language support system
- ✅ **Constants** - Shared configuration and enums

Built with:
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Redux Saga** - Side effect management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- The React Native project must be in the parent directory

### Setup

1. **Install dependencies:**
   ```bash
   cd web
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your API credentials:
   ```env
   NEXT_PUBLIC_API_URL=https://api.faceliftnaturally.me
   NEXT_PUBLIC_ENV=development
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🔨 Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
web/
├── src/
│   ├── api/              # API client (ported from mobile)
│   │   ├── endpoints.ts  # API endpoint definitions
│   │   ├── request.ts    # Axios configuration
│   │   └── index.ts
│   ├── store/            # Redux store
│   │   ├── modules/      # Feature modules
│   │   │   ├── auth/     # Authentication
│   │   │   └── common/   # Global state
│   │   ├── store.ts      # Store configuration
│   │   ├── rootReducer.ts
│   │   ├── rootSaga.ts
│   │   └── hooks.ts      # Typed Redux hooks
│   ├── pages/            # Next.js pages
│   │   ├── _app.tsx      # App wrapper
│   │   ├── _document.tsx # HTML document
│   │   ├── index.tsx     # Landing page
│   │   └── auth/         # Auth pages
│   │       ├── login.tsx
│   │       └── signup.tsx
│   ├── components/       # Reusable components
│   └── styles/          # Global styles
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## 🔑 Key Differences from Mobile App

### Replaced/Adapted:
- **Navigation**: React Navigation → Next.js routing
- **Storage**: AsyncStorage → localStorage + cookies
- **Native modules**: Removed camera, push notifications, IAP
- **Styling**: React Native styles → Tailwind CSS
- **Authentication**: Native SDKs → Web OAuth flows

### Kept Intact:
- **API endpoints and request logic**
- **Redux state management structure**
- **Business logic in sagas**
- **Data transformation utilities**
- **Translation strings**

## 🌐 Deployment

### GitHub Pages (Free)
```bash
cd web
./deploy-gh-pages.sh
```
See [GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md) for detailed setup.

Your site will be at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Vercel (Recommended for Full Features)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the 'out' folder to Netlify
```

### Docker
```bash
docker build -t facelift-web .
docker run -p 3000:3000 facelift-web
```

### Static Export
```bash
npm run build
# Deploy the 'out' folder to any static host
```

## 🔧 Configuration

### API URL
Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your API server.

### OAuth Providers
Configure web OAuth credentials for Google and Facebook in their respective developer consoles.

## 📝 TODO / Next Steps

- [ ] Implement Google Sign-In (Web OAuth 2.0)
- [ ] Implement Facebook Sign-In (Facebook JavaScript SDK)
- [ ] Add user profile pages
- [ ] Add course/exercise viewing pages
- [ ] Implement photo diary with web file upload
- [ ] Add payment integration (Stripe)
- [ ] Add SEO optimization
- [ ] Add PWA support
- [ ] Implement server-side rendering for public pages
- [ ] Add analytics integration

## 🐛 Known Issues

- TypeScript errors expected until dependencies are installed
- Social auth (Google/Facebook) needs web-specific implementation
- Photo upload needs web file handling implementation

## 📄 License

Same license as the main FaceLift Naturally app.

## 🤝 Contributing

This web app shares business logic with the mobile app. When updating:
1. Keep API layer in sync with mobile app
2. Test changes don't break mobile app integration
3. Maintain TypeScript type safety

## 📞 Support

For issues or questions, please contact the development team.
