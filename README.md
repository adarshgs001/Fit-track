# Fitness Tracker Application

A comprehensive fitness tracking platform that empowers users to monitor their workout and nutrition progress through intuitive tools and personalized insights.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [API Documentation](#api-documentation)
5. [Project Structure](#project-structure)
6. [Optimization Opportunities](#optimization-opportunities)
7. [Setup and Installation](#setup-and-installation)
8. [Running the Application](#running-the-application)

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

## API Documentation

### User Management

#### Get User
- **Endpoint**: `GET /api/users/:id`
- **Description**: Retrieves a specific user by ID
- **Response**: User object (password excluded)

#### User Stats
- **Endpoint**: `GET /api/users/:userId/stats`
- **Description**: Retrieves training statistics for a user
- **Response**: Object containing workouts completed, current streak, calories burned, etc.

### Exercise Management

#### Get Exercise Categories
- **Endpoint**: `GET /api/exercise-categories`
- **Description**: Retrieves all exercise categories
- **Response**: Array of exercise category objects

#### Create Exercise Category
- **Endpoint**: `POST /api/exercise-categories`
- **Description**: Creates a new exercise category
- **Request Body**: Exercise category object
- **Response**: Created exercise category

#### Get Exercises
- **Endpoint**: `GET /api/exercises`
- **Description**: Retrieves exercises with optional filtering
- **Query Parameters**:
  - `query`: Search term for exercise name
  - `categoryId`: Filter by category ID
- **Response**: Array of exercise objects

#### Get Exercise by ID
- **Endpoint**: `GET /api/exercises/:id`
- **Description**: Retrieves a specific exercise by ID
- **Response**: Exercise object

#### Create Exercise
- **Endpoint**: `POST /api/exercises`
- **Description**: Creates a new exercise
- **Request Body**: Exercise object
- **Response**: Created exercise

### Workout Plan Management

#### Get User Workout Plans
- **Endpoint**: `GET /api/users/:userId/workout-plans`
- **Description**: Retrieves all workout plans for a user
- **Response**: Array of workout plan objects

#### Get Workout Plan by ID
- **Endpoint**: `GET /api/workout-plans/:id`
- **Description**: Retrieves a specific workout plan by ID
- **Response**: Workout plan object

#### Create Workout Plan
- **Endpoint**: `POST /api/workout-plans`
- **Description**: Creates a new workout plan
- **Request Body**: Workout plan object
- **Response**: Created workout plan

#### Update Workout Plan
- **Endpoint**: `PUT /api/workout-plans/:id`
- **Description**: Updates a workout plan
- **Request Body**: Workout plan object (partial)
- **Response**: Updated workout plan

#### Delete Workout Plan
- **Endpoint**: `DELETE /api/workout-plans/:id`
- **Description**: Deletes a workout plan
- **Response**: 204 No Content

### Workout Management

#### Get User Workouts
- **Endpoint**: `GET /api/users/:userId/workouts`
- **Description**: Retrieves workouts for a user
- **Query Parameters**:
  - `planId`: Filter by workout plan ID
- **Response**: Array of workout objects

#### Get Recent Workouts
- **Endpoint**: `GET /api/users/:userId/recent-workouts`
- **Description**: Retrieves recent workouts for a user
- **Query Parameters**:
  - `limit`: Maximum number of workouts to return (default: 3)
- **Response**: Array of workout objects

#### Get Upcoming Workouts
- **Endpoint**: `GET /api/users/:userId/upcoming-workouts`
- **Description**: Retrieves upcoming workouts for a user
- **Query Parameters**:
  - `limit`: Maximum number of workouts to return (default: 3)
- **Response**: Array of workout objects

#### Get Workout by ID
- **Endpoint**: `GET /api/workouts/:id`
- **Description**: Retrieves a specific workout by ID
- **Response**: Workout object

#### Create Workout
- **Endpoint**: `POST /api/workouts`
- **Description**: Creates a new workout
- **Request Body**: Workout object
- **Response**: Created workout

#### Update Workout
- **Endpoint**: `PUT /api/workouts/:id`
- **Description**: Updates a workout
- **Request Body**: Workout object (partial)
- **Response**: Updated workout

#### Delete Workout
- **Endpoint**: `DELETE /api/workouts/:id`
- **Description**: Deletes a workout
- **Response**: 204 No Content

### Workout Exercise Management

#### Get Workout Exercises
- **Endpoint**: `GET /api/workouts/:workoutId/exercises`
- **Description**: Retrieves exercises for a specific workout
- **Response**: Array of workout exercise objects

#### Create Workout Exercise
- **Endpoint**: `POST /api/workout-exercises`
- **Description**: Adds an exercise to a workout
- **Request Body**: Workout exercise object
- **Response**: Created workout exercise

#### Update Workout Exercise
- **Endpoint**: `PUT /api/workout-exercises/:id`
- **Description**: Updates a workout exercise
- **Request Body**: Workout exercise object (partial)
- **Response**: Updated workout exercise

#### Delete Workout Exercise
- **Endpoint**: `DELETE /api/workout-exercises/:id`
- **Description**: Removes an exercise from a workout
- **Response**: 204 No Content

### Diet Plan Management

#### Get User Diet Plans
- **Endpoint**: `GET /api/users/:userId/diet-plans`
- **Description**: Retrieves all diet plans for a user
- **Response**: Array of diet plan objects

#### Get Active Diet Plan
- **Endpoint**: `GET /api/users/:userId/active-diet-plan`
- **Description**: Retrieves the active diet plan for a user
- **Response**: Diet plan object

#### Get Diet Plan by ID
- **Endpoint**: `GET /api/diet-plans/:id`
- **Description**: Retrieves a specific diet plan by ID
- **Response**: Diet plan object

#### Create Diet Plan
- **Endpoint**: `POST /api/diet-plans`
- **Description**: Creates a new diet plan
- **Request Body**: Diet plan object
- **Response**: Created diet plan

#### Update Diet Plan
- **Endpoint**: `PUT /api/diet-plans/:id`
- **Description**: Updates a diet plan
- **Request Body**: Diet plan object (partial)
- **Response**: Updated diet plan

#### Delete Diet Plan
- **Endpoint**: `DELETE /api/diet-plans/:id`
- **Description**: Deletes a diet plan
- **Response**: 204 No Content

### Meal Management

#### Get User Meals
- **Endpoint**: `GET /api/users/:userId/meals`
- **Description**: Retrieves meals for a user
- **Query Parameters**:
  - `date`: Filter by date
  - `dietPlanId`: Filter by diet plan ID
- **Response**: Array of meal objects

#### Get Meals by Date Range
- **Endpoint**: `GET /api/users/:userId/meals/date-range`
- **Description**: Retrieves meals for a user within a date range
- **Query Parameters**:
  - `startDate`: Start date
  - `endDate`: End date
- **Response**: Array of meal objects

#### Get Meal by ID
- **Endpoint**: `GET /api/meals/:id`
- **Description**: Retrieves a specific meal by ID
- **Response**: Meal object

#### Create Meal
- **Endpoint**: `POST /api/meals`
- **Description**: Creates a new meal
- **Request Body**: Meal object
- **Response**: Created meal

#### Update Meal
- **Endpoint**: `PUT /api/meals/:id`
- **Description**: Updates a meal
- **Request Body**: Meal object (partial)
- **Response**: Updated meal

#### Delete Meal
- **Endpoint**: `DELETE /api/meals/:id`
- **Description**: Deletes a meal
- **Response**: 204 No Content

### Progress Tracking

#### Get User Progress Entries
- **Endpoint**: `GET /api/users/:userId/progress`
- **Description**: Retrieves progress entries for a user
- **Response**: Array of progress entry objects

#### Get Latest Progress Entry
- **Endpoint**: `GET /api/users/:userId/latest-progress`
- **Description**: Retrieves the latest progress entry for a user
- **Response**: Progress entry object

#### Get Progress Entry by ID
- **Endpoint**: `GET /api/progress/:id`
- **Description**: Retrieves a specific progress entry by ID
- **Response**: Progress entry object

#### Create Progress Entry
- **Endpoint**: `POST /api/progress`
- **Description**: Creates a new progress entry
- **Request Body**: Progress entry object
- **Response**: Created progress entry

#### Update Progress Entry
- **Endpoint**: `PUT /api/progress/:id`
- **Description**: Updates a progress entry
- **Request Body**: Progress entry object (partial)
- **Response**: Updated progress entry

#### Delete Progress Entry
- **Endpoint**: `DELETE /api/progress/:id`
- **Description**: Deletes a progress entry
- **Response**: 204 No Content

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

## Optimization Opportunities

### Frontend Optimizations

1. **Implement Code Splitting**: Use React.lazy and Suspense to split code and reduce initial load time
2. **Memoize Components**: Use React.memo for expensive component renders
3. **Optimize React Query Usage**: 
   - Implement proper staleTime and cacheTime settings
   - Use query invalidation strategically
4. **Add Skeleton Loaders**: Enhance user experience during data fetching
5. **Virtualize Long Lists**: For exercise lists and other long data displays, implement virtualization
6. **Optimize Chart Rendering**: Add throttling for chart updates
7. **Implement PWA Features**: Add service workers, offline support, and local caching

### Backend Optimizations

1. **API Response Caching**: Implement caching for frequently accessed data
2. **Rate Limiting**: Add rate limiting to prevent API abuse
3. **Batch API Requests**: Implement batch endpoints for multiple operations
4. **Database Optimization** (for future database integration):
   - Add proper indexing
   - Implement query optimization
   - Consider data denormalization for frequently accessed data

### Performance Issues

1. **Progress Page**: The progress page has rendering issues and needs optimization
2. **Large Data Sets**: Exercise filtering could be more efficient
3. **Form Submissions**: Some forms trigger multiple re-renders

### Security Improvements

1. **Input Validation**: Strengthen API input validation
2. **Authentication**: Implement proper authentication with JWT
3. **Authorization**: Add role-based access control
4. **API Security**: Add CSRF protection and proper error handling

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
