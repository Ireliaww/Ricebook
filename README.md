# Ricebook

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js). Ricebook allows users to share posts, follow other users, comment on content, and manage their profiles.

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Articles/Posts](#articlesposts)
  - [Profile](#profile)
  - [Following](#following)
- [Testing](#testing)
  - [Frontend Tests](#frontend-tests)
  - [Backend Tests](#backend-tests)
- [Deployment](#deployment)
  - [Frontend (Vercel)](#frontend-vercel)
  - [Backend (Render)](#backend-render)
  - [Alternative: Surge (Frontend)](#alternative-surge-frontend)
- [Contributing](#contributing)
- [License](#license)
## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://ricebook-frontend.vercel.app |
| **Backend API** | https://ricebook.onrender.com |

## Features

- **User Authentication**: Register and login with email/password or Google OAuth via Firebase
- **Profile Management**: Customize profile with avatar, headline, and contact information
- **Post Creation**: Share text and image posts with followers
- **Social Interactions**: Follow/unfollow users, comment on posts
- **Dark Mode**: Toggle between light and dark themes
- **Search & Filter**: Filter posts by keywords

## Tech Stack

### Frontend
- React 18 with functional components and hooks
- Redux Toolkit for state management
- Redux Persist for state persistence
- React Router v6 for navigation
- Styled Components & SASS for styling
- Bootstrap & Material-UI for UI components
- Firebase for Google OAuth

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Express Session for authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Multer for file uploads

## Project Structure

```
Ricebook/
├── Frontend/
│   ├── src/
│   │   ├── pages/           # Page components (login, register, home, profile)
│   │   ├── components/      # Reusable UI components
│   │   ├── actions/         # Redux action creators
│   │   ├── reducer/         # Redux reducers
│   │   ├── context/         # React Context providers
│   │   ├── config/          # Configuration files
│   │   └── assets/          # Images and media
│   └── package.json
├── Backend/
│   ├── src/
│   │   ├── auth.js          # Authentication routes
│   │   ├── articles.js      # Post/article CRUD operations
│   │   ├── profile.js       # Profile management endpoints
│   │   ├── following.js     # Follow/unfollow functionality
│   │   ├── comment.js       # Comment routes
│   │   └── model/           # Mongoose schemas
│   ├── index.js             # Express app entry point
│   ├── db.js                # MongoDB connection
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image uploads)
- Firebase project (for Google OAuth)

### Environment Variables

#### Backend
Create a `.env` file in the `Backend` directory:

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
SESSION_SECRET=your_secure_session_secret
FRONTEND_URL=http://localhost:3000
```

#### Frontend
Create a `.env.local` file in the `Frontend` directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ericleah/Ricebook.git
cd Ricebook
```

2. Install backend dependencies:
```bash
cd Backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../Frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd Backend
npm start
```
The server will run on `http://localhost:3001`

2. Start the frontend development server:
```bash
cd Frontend
npm start
```
The app will open in your browser at `http://localhost:3000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |
| PUT | `/logout` | Logout user |

### Articles/Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | Get all articles |
| GET | `/articles/:id` | Get article by ID or user |
| POST | `/article` | Create new article |
| PUT | `/articles/:id` | Update article or add comment |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/headline/:user?` | Get user headline |
| PUT | `/headline` | Update headline |
| GET | `/email/:user?` | Get user email |
| PUT | `/email` | Update email |
| GET | `/avatar/:user?` | Get user avatar |
| PUT | `/avatar` | Upload new avatar |
| PUT | `/password` | Change password |

### Following
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/following/:user?` | Get following list |
| PUT | `/following/:user` | Follow a user |
| DELETE | `/following/:user` | Unfollow a user |

## Testing

### Frontend Tests
```bash
cd Frontend
npm test
```

### Backend Tests
```bash
cd Backend
npm test
```

Tests include:
- Component rendering tests
- Authentication flow tests
- Redux state management tests
- API endpoint validation tests

## Deployment

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
cd Frontend
vercel --prod
```

3. Set environment variable in Vercel dashboard:
   - `REACT_APP_API_BASE_URL` = your backend URL (e.g., `https://ricebook.onrender.com`)

### Backend (Render)

1. Create a new Web Service on [Render Dashboard](https://dashboard.render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free

4. Set environment variables in Render dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `CLOUDINARY_URL` = your Cloudinary URL
   - `SESSION_SECRET` = a secure random string
   - `FRONTEND_URL` = your Vercel frontend URL

### Alternative: Surge (Frontend)
```bash
cd Frontend
npm run deploy:surge
```

> **Note**: Render free tier services spin down after 15 minutes of inactivity. The first request after sleep may take 30-60 seconds.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

ISC License
