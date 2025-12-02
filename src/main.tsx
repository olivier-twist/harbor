import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// UPDATED: Changed path to point to the new location outside of src/
import '../static/resources/css/index.css'; 

// Use the modern React 18 createRoot API to mount the application
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* App is your main component file in src/App.tsx */}
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element in index.html. Cannot mount application.");
}