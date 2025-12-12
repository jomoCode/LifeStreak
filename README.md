# 🟢 Welcome to **LiveStreak**

LiveStreak is a React Native project built with [Expo](https://expo.dev) using [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).  
The app is designed with a scalable **atomic component architecture**, promoting clean separation of concerns and reusability.

---

## Getting Started

### 1️⃣ Install Dependencies

```bash
npm install
2️⃣ Start the App
bash
Copy code
npx expo start
This will launch the Expo Developer Tools, allowing you to run the app on a simulator, emulator, or physical device.

🧩 Component Architecture — Atomic Design
LiveStreak follows the Atomic Design methodology for organizing UI components.
This approach makes components modular, reusable, and easier to test and maintain.

Level	Meaning	Example in this Project
Atom	The smallest, reusable UI pieces — no logic beyond simple props.	TextInput, Button, Label, Text, etc.
Molecule	A group of atoms that work together for a single, specific purpose.	A labeled input field with validation.
Organism	A section or feature composed of multiple molecules that achieve a more complex function.	The entire CreateEventForm with validation, submission, and feedback.
Template	A layout structure where organisms are arranged to form a page section.	A screen layout that positions the form and its related elements.
Page	The full user-facing screen (route-level component).	CreateEventScreen that wraps the form with navigation, header, etc.

🧠 Tech Stack
⚛️ React Native + Expo — Core framework and development environment

🟦 TypeScript — Strongly typed language support

🧾 React Hook Form + Yup — Form handling and validation

💾 Sqlite — Local storage for event data

🧱 Atomic Design Pattern — For scalable and maintainable UI structure

💡 About the Project
LiveStreak helps users manage and track recurring events efficiently.
It’s built with maintainability and scalability in mind — with clear separation between UI components, logic, and storage layers.

Future plans include:

Integrating Firebase or Supabase for data persistence

Adding push notifications and background tracking

Introducing cloud sync and user authentication

🛠️ Common Commands
Command	Description
npm install	Install dependencies
npx expo start	Start Expo development server
npx expo prebuild	Generate native iOS/Android projects
npx expo run:android	Build and run app on Android
npx expo run:ios	Build and run app on iOS

✨ Developer Tips
🧩 Use the atomic pattern to build reusable UI components.
Start from atoms, then compose molecules, organisms, and finally pages.
This keeps your project flexible, modular, and easy to maintain.

Author: Mogbolu John-Johanan
Location: Lekki, Lagos, Nigeria
GitHub: @Jomoartz
LinkedIn: Mogbolu John-Johanan