import React, { useState, useEffect } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  connectAuthEmulator 
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  connectFirestoreEmulator,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { firebaseConfig, appId } from './firebaseConfig';
import AuthScreen from './AuthScreen';

console.log('DEBUG: Firebase Config:', firebaseConfig);
console.log('DEBUG: App ID:', appId);

// --- Firebase Service Initialization ---
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  // Check if configuration is valid
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Invalid Firebase configuration. Check your firebaseConfig.ts file.');
  }

  // Initialize the Firebase App
  app = initializeApp(firebaseConfig);
  
  // Initialize Core Services (Auth and Firestore)
  auth = getAuth(app);
  db = getFirestore(app);

  // Configure Emulators for Local Development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('Harbor: Connected to Firebase Local Emulators.');
  }

} catch (error) {
  console.error('Harbor: Failed to initialize Firebase.', error);
}

// --- Main Application Component ---
const App: React.FC = () => {
  // State for tracking Firebase authentication readiness and user info
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Handle Initial Authentication and State Listening
  useEffect(() => {
    // Check if initialization failed globally (auth is undefined)
    if (!auth) {
      console.error("Firebase Auth not initialized. Cannot proceed.");
      setIsAuthReady(true);
      return;
    }

    // Set up Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
      if (user) {
        console.log(`Harbor: User authenticated. UID: ${user.uid}`);
      } else {
        console.log('Harbor: No user signed in.');
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  // --- UI Rendering Logic ---

  // Check 1: Did the initialization fail in the global scope?
  if (!auth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl border-t-8 border-red-500">
          <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg> Configuration Error
          </h2>
          <p className="text-gray-700 mb-4">
            Harbor could not initialize Firebase. Please check your configuration.
          </p>
          <p className="font-semibold text-gray-800 mt-2">
            ACTION REQUIRED:
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
            <li>Verify <code className="bg-gray-100 px-1 rounded">src/firebaseConfig.ts</code> exists and has valid Firebase credentials</li>
            <li>Check that you've created a Firebase web app: <code className="bg-gray-100 px-1 rounded">firebase apps:create web</code></li>
            <li>Ensure Firebase emulators are running: <code className="bg-gray-100 px-1 rounded">firebase emulators:start</code></li>
          </ul>
        </div>
      </div>
    );
  }

  // Check 2: Are we authenticated yet? (Standard loading screen)
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-indigo-600">
          Loading Harbor: Initializing Services...
        </div>
      </div>
    );
  }

  // Check 3: Show login screen if not authenticated
  if (!currentUser) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  // Main Application UI (User is authenticated)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl py-6 border-b border-indigo-100">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight flex items-center">
          <span className="text-5xl mr-3">⚓</span> Harbor
        </h1>
        <p className="text-sm text-gray-500 mt-1">The Equilibrium Engine | App ID: {appId}</p>
      </header>

      <main className="w-full max-w-4xl mt-10">
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-indigo-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome, {currentUser.email}
          </h2>
          <p className="text-gray-600 mb-4">
            You are now signed in successfully!
          </p>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Authentication Complete</p>
                <p className="text-xs text-green-700 mt-1">
                  Email/Password authentication is working correctly.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700">
            <p className="font-semibold mb-2">Next Development Steps:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>✅ Task 2: Admin Sign-In/Sign-Up (COMPLETE)</li>
              <li>✅ Task 6: Login/Authentication Screen (COMPLETE)</li>
              <li>🔲 Task 7: Create "Create New Team" screen</li>
              <li>🔲 Task 8: Implement Team Dashboard</li>
              <li>🔲 Task 9: Develop "Join Team" screen</li>
              <li>🔲 Task 10: Implement core Dashboard component</li>
            </ul>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">User Information:</h3>
            <div className="text-xs text-gray-600 space-y-1 font-mono">
              <p><span className="font-semibold">UID:</span> {currentUser.uid}</p>
              <p><span className="font-semibold">Email:</span> {currentUser.email}</p>
              <p><span className="font-semibold">Email Verified:</span> {currentUser.emailVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <button
            onClick={() => auth?.signOut()}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
};

// Export initialized services and the main App component
export { app, auth, db, appId };
export default App;