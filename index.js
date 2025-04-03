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

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://kambaz-react-web-app-cs5610-sp25-qyl.netlify.app",
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".netlify.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  }));
  
  

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    sameSite: "none",
    secure: true,
    httpOnly: true,
  }
};


if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
  }
  

app.use(session(sessionOptions));
app.use(express.json());
app.use((req, res, next) => {
    console.log("🔍 Request Cookies:", req.headers.cookie);
    console.log("🧠 Session object:", req.session);
    next();
  });
  
Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
  
