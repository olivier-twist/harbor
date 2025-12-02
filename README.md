# **⚓ Harbor: The Equilibrium Engine**

## **Project Intent: Fostering Sustainable Productivity**

Harbor is an Enterprise SaaS Productivity and Retention Tool designed to move beyond traditional performance monitoring. It functions as an **Equilibrium Engine**—a system that uses gentle "nudges" and personalized insights to help teams find the sustainable balance point between high output and mental well-being.

Our primary goal is to **reduce burnout** and **improve employee retention** by providing managers and team members with early visibility into key behavioral health indicators (e.g., Focus Time Score, Collaboration Score). Harbor aims to create a supportive environment where health metrics are treated as equally important as task completion metrics.

## **Key Benefits**

| Benefit | Description |
| :---- | :---- |
| **Well-being Nudging** | Provides subtle, personalized guidance to prevent overwork and ensure adequate restorative time, actively supporting mental health. |
| **Retention Catalyst** | By directly addressing burnout and work imbalance, Harbor serves as a critical tool for improving employee satisfaction and significantly boosting long-term retention rates. |
| **Data Clarity** | Translates complex behavioral data into simple, actionable metrics displayed on a personalized dashboard. |
| **Seamless Onboarding** | Features a simple Admin-driven team creation and invitation flow, ensuring rapid adoption across organizations. |

## **Technology Stack (Sprint 1\)**

This MVP is built using a modern, efficient, and serverless architecture.

* **Frontend:** **React** (Component-based UI/UX)  
* **Styling:** **Tailwind CSS** (Utility-first framework for responsive, modern design)  
* **Backend/Database:** **Firebase/Firestore** (NoSQL, Real-time data storage)  
* **Authentication:** **Firebase Authentication** (Secure user identity and access control)

## **Installation and Local Deployment**

The **Harbor** MVP is developed as a single-file application connecting directly to Firebase services. We use the Firebase Local Emulators for development to ensure faster iteration and safe testing without modifying live data.

### **Prerequisites**

1. **Node.js & npm:** Ensure these are installed on your MacBook Pro (M2 Chip).  
2. **Firebase CLI:** Global installation required:  
   npm install \-g firebase-tools

### **Step 1: Initialize Firebase Project**

1. Log into your Google account via the CLI:  
   firebase login

2. Navigate to the project root directory and initialize the necessary services:  
   firebase init  
   \# Select 'Use an existing project' (or create a new one)  
   \# Select: 'Firestore' and 'Emulators'

### **Step 2: Start Local Emulators**

Start the local server environment, focusing on the services needed for Sprint 1 (Authentication and Firestore).

\# This command starts the local backend services  
firebase emulators:start \--only auth,firestore,hosting

This will launch the Emulator Suite UI (usually at http://localhost:4000), allowing you to inspect your local database and mock user accounts.

### **Step 3: Connect Frontend to Emulators**

In your main React component, ensure the Firebase SDK is configured to connect to the local emulators when running locally (localhost). This prevents development work from accidentally writing to the live cloud database.

import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';  
import { connectAuthEmulator, getAuth } from 'firebase/auth';  
// ... initialization code ...

const db \= getFirestore(app);  
const auth \= getAuth(app);

// IMPORTANT: Connect to emulators for local development  
if (window.location.hostname \=== "localhost") {  
  connectFirestoreEmulator(db, 'localhost', 8080);   // Firestore default port  
  connectAuthEmulator(auth, 'http://localhost:9099'); // Auth default port  
}

### **Deployment (Future)**

Once development is complete, the application can be deployed to Firebase Hosting directly using the CLI:

firebase deploy \--only hosting

## **Development Status**

Current Epic: Epic 1 \- Core User Onboarding and Personalized Activity Dashboard  
Current Sprint: Sprint 1  
Next Action: Begin implementing the React components and Firebase logic as defined in the sprint\_1\_plan.md.