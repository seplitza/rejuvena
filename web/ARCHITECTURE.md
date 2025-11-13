# 🏗️ Web App Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FaceLift Naturally                        │
│                      Web Application                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├── Next.js 14 (React)
                              ├── TypeScript
                              ├── Tailwind CSS
                              └── Redux + Redux Saga
                              
┌──────────────────────────────────────────────────────────────┐
│                        Frontend Layer                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Pages (Next.js)                                             │
│  ├── / (Landing)                                             │
│  ├── /auth/login                                             │
│  ├── /auth/signup                                            │
│  └── ... (more pages to be added)                           │
│                                                               │
│  Components                                                   │
│  ├── Forms                                                    │
│  ├── Buttons                                                  │
│  ├── Inputs                                                   │
│  └── Layout                                                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                      State Management                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Redux Store                                                  │
│  ├── Auth Module                                             │
│  │   ├── State: token, user, loading, error                 │
│  │   └── Actions: login, signup, logout                     │
│  │                                                            │
│  ├── Common Module                                           │
│  │   ├── State: language, loading, notifications            │
│  │   └── Actions: setLanguage, showNotification             │
│  │                                                            │
│  └── ... (more modules from mobile app)                     │
│                                                               │
│  Redux Sagas (Side Effects)                                  │
│  ├── Auth Sagas                                              │
│  │   ├── loginWithEmailSaga                                  │
│  │   ├── signupWithEmailSaga                                 │
│  │   ├── resetPasswordSaga                                   │
│  │   └── socialAuthSagas                                     │
│  │                                                            │
│  └── ... (more sagas)                                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                         API Layer                             │
│                   (Ported from Mobile App)                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Axios Instance (request.ts)                                 │
│  ├── Base URL: API_URL/api                                   │
│  ├── Request Interceptor                                     │
│  │   ├── Add JWT token from localStorage                    │
│  │   └── Add user language header                           │
│  │                                                            │
│  └── Response Interceptor                                    │
│      ├── Handle success                                      │
│      └── Handle errors                                       │
│                                                               │
│  Endpoints (endpoints.ts)                                    │
│  ├── Auth: /token/auth, /user/register                      │
│  ├── User: /user/getuserprofiledetail                       │
│  ├── Courses: /usermarathon/*                               │
│  ├── Photos: /contest/*                                     │
│  └── ... (50+ endpoints)                                     │
│                                                               │
│  Auth Token Manager                                          │
│  ├── get() - Get token from localStorage                    │
│  ├── set() - Save token to localStorage                     │
│  └── remove() - Clear token                                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                      Backend API                              │
│              (Same as Mobile App)                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  https://api.faceliftnaturally.me/api                        │
│                                                               │
│  Endpoints:                                                   │
│  ├── Authentication                                          │
│  ├── User Management                                         │
│  ├── Course Content                                          │
│  ├── Exercise Tracking                                       │
│  ├── Photo Diary                                             │
│  └── Payment Processing                                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
```
User Action (Login)
    ↓
Component dispatches loginWithEmail()
    ↓
Redux Action → Auth Saga
    ↓
loginWithEmailSaga() executes
    ↓
Calls API via Axios (request.post)
    ↓
Request Interceptor adds headers
    ↓
Backend API processes request
    ↓
Response Interceptor handles response
    ↓
Saga receives response
    ↓
Saga dispatches setAuthToken()
    ↓
Reducer updates state
    ↓
Component re-renders with new state
    ↓
User redirected to dashboard
```

## File Structure Mapping

### Mobile App → Web App

```
Mobile App                    Web App
────────────────────────────────────────────
app/api/                  →   src/api/
├── endpoints.js          →   ├── endpoints.ts
├── request.js            →   ├── request.ts
└── index.js              →   └── index.ts

app/redux/                →   src/store/
├── store.js              →   ├── store.ts
├── rootReducer.js        →   ├── rootReducer.ts
└── rootSagas.js          →   └── rootSaga.ts

app/modules/auth/         →   src/store/modules/auth/
├── slice.js              →   ├── slice.ts
├── sagas.js              →   └── sagas.ts

app/utils/                →   src/utils/
├── AuthToken.js          →   (Integrated in request.ts)

React Native Views        →   Next.js Pages
├── LoginScreen           →   ├── pages/auth/login.tsx
├── SignupScreen          →   └── pages/auth/signup.tsx
```

## Technology Comparison

| Feature          | Mobile App              | Web App                |
|------------------|-------------------------|------------------------|
| Framework        | React Native 0.63       | Next.js 14             |
| Language         | JavaScript (Flow)       | TypeScript             |
| State            | Redux Toolkit           | Redux Toolkit          |
| Side Effects     | Redux Saga              | Redux Saga             |
| Navigation       | React Navigation        | Next.js Router         |
| Storage          | AsyncStorage            | localStorage           |
| Styling          | StyleSheet              | Tailwind CSS           |
| HTTP Client      | Axios                   | Axios                  |
| Auth Token       | AsyncStorage            | localStorage           |

## Reuse Statistics

```
API Layer:          100% reused
Business Logic:     95% reused
Data Models:        100% compatible
Redux Structure:    95% reused
UI Components:      0% reused (web-specific)
Navigation:         Replaced
Storage:            Adapted
```

## Deployment Architecture

```
┌──────────────────┐
│   Git Repository │
│   (GitHub, etc.) │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   CI/CD Pipeline │
│   (Vercel, etc.) │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   Build Process  │
│   - npm install  │
│   - npm build    │
│   - Optimize     │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   CDN/Hosting    │
│   - Static files │
│   - API routes   │
│   - SSR          │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│   Users          │
│   (Browsers)     │
└──────────────────┘
```

---

This architecture ensures:
- ✅ Maximum code reuse from mobile app
- ✅ Type safety with TypeScript
- ✅ Scalable state management
- ✅ Clean separation of concerns
- ✅ Easy to maintain and extend
