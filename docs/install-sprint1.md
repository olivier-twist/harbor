# Harbor - Sprint 1 Installation Guide (Command Line Development)

## Overview
This guide will help you set up Harbor for local development using the Firebase CLI and standard web development tools. Harbor is a React-based web application that uses Firebase for authentication and data storage.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for version control) - [Download](https://git-scm.com/)
- **Firebase CLI** - Install globally:
  ```bash
  npm install -g firebase-tools
  ```

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/

2. **Create a new project**:
   - Click "Add project"
   - Enter project name (e.g., "harbor-app")
   - Follow the setup wizard
   - Enable Google Analytics (optional)

3. **Enable Authentication**:
   - In Firebase Console, go to **Authentication** → **Get Started**
   - Enable **Anonymous** sign-in provider
   - Click "Save"

4. **Create Firestore Database**:
   - Go to **Firestore Database** → **Create Database**
   - Choose "Start in test mode" (we'll add security rules later)
   - Select your database location (e.g., `nam5` for US)
   - Click "Enable"

## Step 2: Set Up Local Project

1. **Create project directory**:
   ```bash
   mkdir harbor
   cd harbor
   ```

2. **Initialize npm project**:
   ```bash
   npm init -y
   ```

3. **Install dependencies**:
   ```bash
   # Core dependencies
   npm install react react-dom
   npm install firebase

   # Development dependencies
   npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom

   # Tailwind CSS for styling
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Create project structure**:
   ```bash
   mkdir -p src static/resources/css
   ```

## Step 3: Initialize Firebase in Your Project

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Initialize Firebase project**:
   ```bash
   firebase init
   ```
   
   Select the following options:
   - **Which Firebase features?**: 
     - ✓ Firestore
     - ✓ Functions (optional, for later)
     - ✓ Hosting
   - **Use an existing project**: Select your Harbor project
   - **Firestore rules file**: `firestore.rules` (default)
   - **Firestore indexes file**: `firestore.indexes.json` (default)
   - **Public directory**: `public`
   - **Configure as SPA**: Yes
   - **Set up automatic builds**: No
   - **Overwrite index.html**: No

3. **Register a web app**:
   ```bash
   firebase apps:create web harbor-web-app
   ```

4. **Get your Firebase configuration**:
   ```bash
   firebase apps:sdkconfig web
   ```
   
   This will output something like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

## Step 4: Configure Project Files

### 4.1 Create Firebase Config

Create `src/firebaseConfig.ts`:
```typescript
// src/firebaseConfig.ts
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

export const appId = 'harbor-default';
```
**⚠️ Replace the values with your actual Firebase config from Step 3.4**

### 4.2 Update firebase.json

Edit `firebase.json`:
```json
{
  "firestore": {
    "database": "(default)",
    "location": "nam5",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 6001
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

### 4.3 Create vite.config.js

Create `vite.config.js` in the project root:
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public',
    sourcemap: true,
  }
});
```

### 4.4 Update package.json Scripts

Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "emulators": "npm run build && firebase emulators:start --only auth,firestore,hosting",
    "deploy": "npm run build && firebase deploy"
  }
}
```

### 4.5 Configure Tailwind CSS

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4.6 Create CSS File

Create `static/resources/css/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 4.7 Create index.html

Create `index.html` in the project root:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harbor - The Equilibrium Engine</title>
    <script type="module" src="/src/main.tsx"></script>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

### 4.8 Create main.tsx

Create `src/main.tsx`:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../static/resources/css/index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element. Cannot mount application.");
}
```

### 4.9 Create App.tsx

Create `src/App.tsx` - use the complete App.tsx code provided separately.

### 4.10 Create TypeScript Config

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.js"]
}
```

### 4.11 Create .gitignore

Create `.gitignore`:
```
# Dependencies
node_modules/

# Build output
public/
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Firebase
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Step 5: Run the Application

### Development with Emulators (Recommended)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start Firebase emulators**:
   ```bash
   firebase emulators:start --only auth,firestore,hosting
   ```
   
   Or use the npm script:
   ```bash
   npm run emulators
   ```

3. **Access the application**:
   - **Main App**: http://localhost:6001
   - **Emulator UI**: http://localhost:4000

4. **Watch for changes** (in a separate terminal):
   ```bash
   npm run dev
   ```
   Then rebuild and the emulator will pick up changes.

### Quick Development (Vite Dev Server)

For rapid UI development without Firebase features:
```bash
npm run dev
```
Access at: http://localhost:5173

**⚠️ Note**: Firebase won't work in this mode since emulators aren't running.

## Step 6: Verify Installation

When you access http://localhost:6001, you should see:

1. **Success Screen**: 
   - Harbor header with anchor emoji
   - "Welcome, User..." message
   - Green "Firebase Connected" notification
   - User information display

2. **Console Logs** (in browser DevTools):
   ```
   DEBUG: Firebase Config: {apiKey: "...", ...}
   Harbor: Connected to Firebase Local Emulators.
   Harbor: Signed in anonymously.
   Harbor: User authenticated. UID: ...
   ```

3. **Emulator UI** (http://localhost:4000):
   - Check Authentication tab - should see anonymous user
   - Check Firestore tab - should see database (empty for now)

## Step 7: Next Development Steps

### Sprint 1 Tasks Remaining:

1. **Task 6**: Implement Login/Authentication UI
   - Email/password sign-in
   - User registration
   - Replace anonymous auth

2. **Task 8**: Implement Admin Dashboard
   - Team creation interface
   - Member management
   - Task distribution controls

3. **Task 10**: Implement Member Dashboard
   - View assigned tasks
   - Task completion tracking
   - Team status overview

## Troubleshooting

### "Firebase Config is empty"
- Verify `src/firebaseConfig.ts` has correct values
- Check that you ran `firebase apps:create web`

### "Cannot connect to emulators"
- Ensure emulators are running: `firebase emulators:start`
- Check ports aren't in use (8080, 9099, 6001, 4000)
- Try restarting emulators

### "Module not found" errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules/` and `package-lock.json`, then run `npm install` again

### Build fails
- Check Node.js version: `node --version` (should be v18+)
- Clear Vite cache: `rm -rf node_modules/.vite`
- Rebuild: `npm run build`

### "Port already in use"
- Kill processes using the ports:
  ```bash
  # macOS/Linux
  lsof -ti:6001 | xargs kill
  
  # Windows
  netstat -ano | findstr :6001
  taskkill /PID <PID> /F
  ```

## Production Deployment

When ready to deploy to production:

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy everything (hosting, firestore rules, etc.)
firebase deploy
```

Your app will be available at: `https://YOUR-PROJECT-ID.web.app`

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Project Structure Summary

```
harbor/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   └── firebaseConfig.ts    # Firebase configuration
├── static/
│   └── resources/
│       └── css/
│           └── index.css    # Tailwind styles
├── public/                  # Build output (generated)
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── firebase.json            # Firebase project config
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # npm dependencies and scripts
└── .gitignore              # Git ignore rules
```

---

**You're now ready to start developing Harbor!** 🎉

For questions or issues, refer to the troubleshooting section above or check the Firebase documentation.