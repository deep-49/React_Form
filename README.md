# User Registration App

## Project Setup
This project is a simple User Registration App built with React and Vite. It allows users to register and displays them dynamically in a list.

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

## Installation
### Step 1: Initialize React Project with Vite
Run the following command to create a React app using Vite:
```sh
npx create-vite@latest user-registration-app --template react
cd user-registration-app
```

### Step 2: Install Dependencies
Install required packages:
```sh
npm install
```

### Step 3: Install Tailwind CSS
Run the following command:
```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Configure `tailwind.config.js`:
```js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
Add Tailwind to `index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Install Material UI
Run:
```sh
npm install @mui/material @emotion/react @emotion/styled
```
### Step 5: Install All Necessary Dependencies

## Running the Project
Start the development server:
```sh
npm run dev
```

## Features
- User registration form
- Displays a dynamically updated user list

## Folder Structure
```
user-registration-app/
├── src/
│   ├── components/
│   │   ├── UserManagementApp.jsx
│   │  
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
├── tailwind.config.js
├── package.json
├── vite.config.js
```

## Components
### `UserManagementApp.jsx`
- A form where users can enter their details and register.Then they will be displayed at a list.



