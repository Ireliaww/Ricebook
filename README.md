# Ricebook

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js). Ricebook allows users to share posts, follow other users, comment on content, and manage their profiles.

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

Create a `.env` file in the `Backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
PORT=3001
NODE_ENV=development
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

### Frontend
The frontend can be deployed to Surge:
```bash
cd Frontend
npm run deploy
```

### Backend
The backend is configured for Heroku deployment with the included `Procfile`.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

ISC License
