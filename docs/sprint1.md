# **Sprint 1: Core User Onboarding and Personalized Activity Dashboard**

This sprint focuses on the absolute minimum required to get an administrator and a team member authenticated and viewing a personalized dashboard.

## **I. Detailed Sprint Tasks**

### **A. Backend & Authentication Tasks (Admin Focus)**

1. Initialize Firebase/Firestore for database and authentication services.  
2. Implement Admin Sign-In/Sign-Up functionality (using email/password or custom token authentication).  
3. Create the teams Firestore collection structure (/artifacts/{appId}/public/data/teams/{teamId}).  
4. Develop a function to generate a unique, time-limited team invitation link/code.  
5. Implement data access rules to ensure only team members can read their team's data (covered by Firebase security rules, but requires code setup).

### **B. Frontend & UI Tasks**

6. Design and implement the Login/Authentication screen.  
7. Create the "Create New Team" screen (form for Team Name, Description).  
8. Implement the Team Dashboard screen (initially displays only the invitation link).  
9. Develop the "Join Team" screen for invited users (input field for invitation code/link).  
10. Implement the core Dashboard component structure to display user-specific metrics.

### **C. Core Logic & Data Display Tasks**

11. Implement the logic for the admin to create a team document in Firestore.  
12. Implement the logic for a new user to validate an invitation link and update their user profile document with the teamId.  
13. Mock up and integrate 3 key data points for the personalized dashboard (e.g., "Tasks Completed," "Focus Time," "Collaboration Score") with placeholder values/logic.

## **II. Canvas/Figma Screen Blueprints**

This MVP requires three primary screens (for both Admin and Team Member flows).

### **Screen 1: Authentication (Shared)**

|

| Element | Details |  
| Layout | Centered card on a minimalist background. |  
| Inputs | Email Address, Password. |  
| Actions | "Sign In," "Sign Up." |  
| Error | Simple, non-intrusive red text box for authentication failures (e.g., "Invalid credentials"). |

### **Screen 2: Admin \- Team Creation**

| Element | Details |  
| Header | "Create Your First Team" |  
| Inputs | Team Name (Required, e.g., "Product Team Alpha"), Team Goal/Description (Optional, short text). |  
| Actions | "Create Team" (Primary), "Cancel." |  
| Success State | Redirects to the Team Dashboard (Screen 3, Admin view). |

### **Screen 3: Dashboard (Admin & Member View)**

| Element | Details |  
| Header | Welcome,  
$$User Name$$  
\! (Team:

$$Team Name$$  
) |  
| Admin Only Section | Invitation Panel: Displays the unique Team Invitation Link and a "Copy Link" button. |  
| Core Dashboard (All Users) | Three card components using rounded corners and shadows (Tailwind): |  
| Card 1 | Title: Tasks Completed (Mock Data: 12 / 15\) |  
| Card 2 | Title: Focus Time Score (Mock Data: 85% (High)) |  
| Card 3 | Title: Collaboration Score (Mock Data: 7.2 / 10\) |  
| Layout | Responsive, using a grid layout (1 column on mobile, 3 columns on desktop). |

## **III. Behavioral Test Prompts (Acceptance Criteria)**

These prompts define the success criteria for the functionality implemented in Sprint 1\.

### **Feature: Admin Team Setup**

| Scenario | Gherkin |  
| AC-1.1: Successful Team Creation | Given an authenticated user is an Admin, When they navigate to the "Create Team" screen and submit a valid team name, Then a new document should be created in the teams Firestore collection, And the Admin is navigated to the Team Dashboard showing the new Team Name. |  
| AC-1.2: Invitation Link Generation | Given the Admin is viewing the Team Dashboard, When the page loads, Then a unique, copyable invitation link/code should be displayed. |

### **Feature: New User Onboarding**

| Scenario | Gherkin |  
| AC-2.1: Joining via Invitation Link | Given an unauthenticated user clicks a valid invitation link, When they complete the Sign-Up process (email/password), Then their user profile document should be associated with the corresponding teamId in Firestore, And they are redirected to the Core Dashboard (Screen 3). |  
| AC-2.2: Invalid Invitation Handling | Given an unauthenticated user manually enters an expired or invalid invitation code, When they attempt to join, Then an error message "Invalid or Expired Invitation" should be displayed, And they remain on the Join Team screen. |

### **Feature: Core Activity Dashboard**

| Scenario | Gherkin |  
| AC-3.1: Personalized Metric Display | Given an authenticated Team Member is viewing the Dashboard, When the dashboard loads, Then the three core metric cards ("Tasks Completed," "Focus Time Score," "Collaboration Score") should display their mock placeholder values correctly. |  
| AC-3.2: Responsive Dashboard Layout | Given the Team Member views the Dashboard on a small screen (mobile), When they resize the browser to a large screen (desktop), Then the core metric cards should transition smoothly from a single-column layout to a three-column layout. |