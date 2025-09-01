# Overview

Arise Learning is a mobile-first educational platform designed for students to learn subjects through interactive lessons and quizzes. The application features a React frontend with a Node.js/Express backend, implementing a gamified learning experience with achievement tracking, progress monitoring, and offline capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state with local storage for authentication
- **Mobile-First Design**: Responsive design optimized for mobile devices with PWA capabilities

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with JSON responses
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom middleware for API request logging and performance monitoring

## Data Storage & Schema
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: 
  - Users table with profile information, points, and achievements
  - Subjects, lessons, and quizzes with hierarchical relationships
  - Progress tracking and quiz attempts for learning analytics
  - OTP verification system for authentication
- **Migrations**: Drizzle Kit for database schema management

## Authentication & Authorization
- **Authentication Method**: OTP-based authentication via mobile number
- **Session Management**: Local storage for user session persistence
- **User Flow**: Mobile number → OTP verification → Profile setup → Dashboard access

## Key Features Implementation
- **Gamification**: Points system, achievements, and progress tracking
- **Offline Support**: Service worker for caching with offline lesson storage
- **Progress Tracking**: Granular tracking of lesson completion and quiz performance
- **Responsive Design**: Mobile-optimized UI with bottom navigation

## Development Workflow
- **Development Server**: Vite dev server with HMR for frontend, tsx for backend development
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Code Quality**: TypeScript strict mode with path aliases for clean imports

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon database connection for PostgreSQL
- **drizzle-orm** & **drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management and caching

## UI & Styling Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-aware component APIs
- **lucide-react**: Icon library for React components

## Development & Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development tooling

## Form & Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for form handling
- **zod**: Runtime type validation and schema definition

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx** & **tailwind-merge**: Conditional CSS class utilities
- **cmdk**: Command palette component for search interfaces