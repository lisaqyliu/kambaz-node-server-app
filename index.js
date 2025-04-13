import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const app = express();

// ✅ Log current environment
console.log("🌍 NODE_ENV:", process.env.NODE_ENV);

// ✅ Development check
const isDev = process.env.NODE_ENV === "development";

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://kambaz-react-web-app-cs5610-sp25-qyl.netlify.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /\.netlify\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Session options (single source of truth)
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  proxy: !isDev, // only true in prod behind proxy
  cookie: {
    httpOnly: true,
    secure: !isDev, // must be false in dev for cookies to work
    sameSite: isDev ? "lax" : "none", // lax in dev, none in prod
  },
};

app.use(session(sessionOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log("🔍 Request Cookies:", req.headers.cookie);
  console.log("🧠 Session object:", req.session);
  console.log("🌍 NODE_ENV =", process.env.NODE_ENV);
  next();
});

// ✅ Your routes
Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);

// ✅ Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
