# RecipeNest UI 🍳

This is the official frontend for the RecipeNest application, built with **React** and **Vite**. It provides a clean, modern, and responsive user interface that communicates with the [RecipeNest .NET API](https://github.com/SayubShakya/react-recipe-nest-frontend) to deliver a seamless experience for food lovers, chefs, and admin.

## Features ✨

- **Modern UI**: A clean and responsive user experience built with React and Vite.
- **Component-Based Architecture**: Reusable components for headers, footers, recipe cards, and more.
- **User Authentication**: Secure pages for user registration and login.
- **Role-Based Views**: Tailored dashboards and functionality for:
    - **Admins**: To manage platform content.
    - **Chefs**: To showcase their profiles and recipes.
    - **FoodLovers**: To discover recipes and manage their profiles.
- **Dynamic Routing**: A multi-page feel using React Router for navigating between home, recipes, profiles, and authentication pages.
- **API Integration**: Efficiently fetches and sends data to the backend API.

## Tech Stack 💻

- **Framework**: React
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **API Communication**: Fetch API
- **Styling**: CSS 

## Installation 🛠️

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running instance of the [RecipeNest Backend API](https://github.com/SayubShakya/dotnet-recipe-nest-backend).

### Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/SayubShakya/react-recipe-nest-backend.git
    cd react-recipe-nest-frontend
    ```

2.  Install the required dependencies:
    ```bash
    npm install
    npm install react-toastify
    npm run dev
    ``

3.  Open your browser and navigate to `http://localhost:5173` (or the address provided by Vite).