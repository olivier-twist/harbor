import React, { useState, useEffect } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  User, 
  signInAnonymously, 
  onAuthStateChanged, 
  connectAuthEmulator 
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { firebaseConfig, appId } from './firebaseConfig';

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
      console.error("Firebase Auth not initialized. Cannot proceed with sign-in.");
      setIsAuthReady(true); // Stop the loading screen if initialization failed.
      return;
    }

    // Initial Sign-In Attempt (anonymous)
    const handleInitialAuth = async () => {
      try {
        await signInAnonymously(auth);
        console.log('Harbor: Signed in anonymously.');
      } catch (error) {
        console.error('Harbor: Initial authentication failed.', error);
      }
    };
    
    // Set up Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true); // Auth state has been checked
      if (user) {
        console.log(`Harbor: User authenticated. UID: ${user.uid}`);
      }
    });

    // Run the sign-in and start listening
    handleInitialAuth(); 

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []); // Run only once on mount

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

  // Main Application UI
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl py-6 border-b border-indigo-100">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight flex items-center">
          <span className="text-5xl mr-3">⚓</span> Harbor
        </h1>
        <p className="text-sm text-gray-500 mt-1">The Equilibrium Engine | App ID: {appId}</p>
      </header>

      <main className="w-full max-w-4xl mt-10">
        {currentUser ? (
          // Placeholder for Dashboard (Screen 2/3 from Sprint)
          <div className="bg-white p-8 rounded-xl shadow-2xl border border-indigo-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome, User {currentUser.uid.substring(0, 8)}...
            </h2>
            <p className="text-gray-600 mb-4">
              Authentication successful! You are now signed in anonymously.
            </p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">Firebase Connected</p>
                  <p className="text-xs text-green-700 mt-1">
                    Auth, Firestore, and Hosting emulators are working correctly.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700">
              <p className="font-semibold mb-2">Next Development Steps:</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Implement Screen 1: Login/Authentication UI (Sprint Task 6)</li>
                <li>Implement Screen 2: Admin Dashboard (Sprint Task 8)</li>
                <li>Implement Screen 3: Member Dashboard (Sprint Task 10)</li>
                <li>Create team creation workflow</li>
                <li>Build task distribution system</li>
              </ul>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">User Information:</h3>
              <div className="text-xs text-gray-600 space-y-1 font-mono">
                <p><span className="font-semibold">UID:</span> {currentUser.uid}</p>
                <p><span className="font-semibold">Anonymous:</span> {currentUser.isAnonymous ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">Provider:</span> {currentUser.providerId}</p>
              </div>
            </div>
          </div>
        ) : (
          // Placeholder for Authentication Screen (shouldn't happen often due to auto-sign-in)
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              You are not currently signed in. This shouldn't happen with anonymous auth enabled.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Next Task:</span> Implement the full Sign-In/Sign-Up form here (Sprint Task 6).
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Export initialized services and the main App component
export { app, auth, db, appId };
export default App;