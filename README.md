# Fitness Tracker Application

A comprehensive fitness tracking platform that empowers users to monitor their workout and nutrition progress through intuitive tools and personalized insights.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [API Documentation](#api-documentation)
5. [Project Structure](#project-structure)
6. [Setup and Installation](#setup-and-installation)
7. [Running the Application](#running-the-application)

## Overview

This fitness tracking application provides users with a comprehensive solution to manage and track their fitness journey. Users can track workouts, create custom workout plans, log exercises, monitor nutrition, and view detailed progress metrics over time.

## Features

- **Dashboard**: Overview of workout progress, nutrition, and health metrics
- **Workout Management**:
  - Create and manage workout plans
  - Schedule workouts
  - Track workout history
  - Smart workout recommendations
- **Exercise Library**:
  - Comprehensive exercise database
  - Exercise categorization
  - Exercise detail pages with video demonstrations
  - Search and filtering capabilities
- **Nutrition Tracking**:
  - Meal planning and logging
  - Diet plan management
  - Nutrition overview and analytics
- **Progress Monitoring**:
  - Weight and body measurements tracking
  - Visual progress charts
  - Workout activity history
  - Strength progression tracking
- **User Profile**:
  - Personalized user settings
  - Progress statistics
  - Goal setting and tracking

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - TanStack Query (React Query) for data fetching
  - Tailwind CSS with shadcn components
  - Recharts for data visualization
  - Wouter for routing
  - React Hook Form for form management
  - Zod for validation

- **Backend**:
  - Node.js with Express
  - TypeScript
  - In-memory data storage (MemStorage)
  - Drizzle ORM with zod schemas


## Project Structure

```
├── client                   # Frontend React application
│   ├── src
│   │   ├── components       # UI components
│   │   │   ├── dashboard    # Dashboard-related components
│   │   │   ├── diet         # Diet-related components
│   │   │   ├── exercise     # Exercise-related components
│   │   │   ├── layout       # Layout components
│   │   │   ├── progress     # Progress-related components
│   │   │   ├── ui           # Reusable UI components
│   │   │   └── workout      # Workout-related components
│   │   ├── hooks            # Custom React hooks
│   │   ├── lib              # Utility functions and config
│   │   ├── pages            # Page components
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Entry point
├── server                   # Backend Express application
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Data storage implementation
│   └── vite.ts              # Vite server configuration
├── shared                   # Shared code between client and server
│   └── schema.ts            # Data models and schema definitions
└── README.md                # Project documentation
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (if necessary)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Running the Application

The application runs on a development server that serves both the backend API and the frontend application:

- Frontend: [http://localhost:5000](http://localhost:5000)
- API: [http://localhost:5000/api](http://localhost:5000/api)

A workflow named 'Start application' is configured to run the server with `npm run dev`.
