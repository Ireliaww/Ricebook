require("dotenv").config();
require("./db");
const { AuthRoutes } = require("./src/auth");
const ArticlesRoutes = require("./src/articles");
const ProfileRoutes = require("./src/profile");
const FollowingRoutes = require("./src/following");
const CommentRoutes = require("./src/comment");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan"); // HTTP request logger

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev")); // Log all incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust Heroku's proxy for secure cookies
app.set("trust proxy", 1);

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "rice university",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: "none", // Required for cross-site cookies
    },
  })
);

// Configure CORS to allow credentials and the frontend origin
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://cw206ricebook-v1.surge.sh"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// Define routes
app.get("/", (req, res) => res.send({ hello: "world" }));
AuthRoutes(app);
ArticlesRoutes(app);
ProfileRoutes(app);
FollowingRoutes(app);
CommentRoutes(app);

// Start the server
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

// Export the app for testing
module.exports = app;
