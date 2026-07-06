# Task Manager Application (Navi)

A modern, responsive, and beginner-friendly Full-Stack Task Management application.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (Raw SQL queries, no ORM)
- **Authentication**: JWT login/register, Password hashing using bcryptjs

---

## Folder Structure

```text
navi/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI Components (TaskCard, TaskForm, etc.)
│   │   ├── layouts/        # Shared layouts (AuthLayout, DashboardLayout)
│   │   ├── pages/          # Page views (Dashboard, Tasks, Profile, etc.)
│   │   ├── services/       # API communication services (auth, task, api)
│   │   ├── types/          # TypeScript declarations
│   │   ├── App.tsx         # Root routes and state
│   │   └── main.tsx        # React mounting entrypoint
│   └── package.json
│
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database and server config
│   │   ├── controllers/    # Request and response handlers
│   │   ├── middlewares/    # Auth and error middleware
│   │   ├── repositories/   # Direct database access using PG client
│   │   ├── routes/         # Router declarations
│   │   ├── services/       # Business logic layer
│   │   └── index.ts        # Server entrypoint
│   └── package.json
│
└── database/
    └── schema.sql          # Database table setups & seed data
```

---

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [PostgreSQL](https://www.postgresql.org/) database running locally or hosted

---

## Setup Instructions

### 1. Database Setup

1. Open your PostgreSQL query tool (like `psql` or PGAdmin).
2. Create a new database named `taskmanager`:
   ```sql
   CREATE DATABASE taskmanager;
   ```
3. Connect to the newly created database and run the script inside [schema.sql](file:///c:/Users/Vasanth/OneDrive/Desktop/navi/database/schema.sql) to set up tables index setups and seed some mock data:
   ```bash
   psql -U postgres -d taskmanager -f database/schema.sql
   ```

### 2. Backend Setup (`server`)

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Configure `.env` with your PostgreSQL database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmanager
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:5000`.

### 3. Frontend Setup (`client`)

1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:5173`. Open this URL in your browser to check out the application!

---

## Features Implemented

- **JWT Authentication**: Secure login/registration flows, storing JWT token inside client state & LocalStorage.
- **Responsive Dashboard**: Summary statistics of total, pending, in-progress, and completed tasks alongside a progress bar.
- **CRUD Operations**: Create, view, update, status-change, and delete tasks instantly.
- **Modern UI**: Full Dark Mode design with custom glassmorphism components built with Tailwind CSS.
- **Robust Error Handling**: Standardized express error handling middleware and UI alerts.
