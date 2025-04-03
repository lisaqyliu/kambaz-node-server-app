import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


export default function UserRoutes(app) {
  const createUser = async (req, res) => { };

  const deleteUser = async (req, res) => { };

  const findAllUsers = async (req, res) => { };

  const findUserById = async (req, res) => { };

  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);

    const updatedUser = await dao.findUserById(userId);
    req.session.currentUser = updatedUser; 
    res.json(updatedUser);
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      return res.status(400).json({ message: "Username already in use" });
    }
    const newUser = await dao.createUser(req.body);
    req.session.currentUser = newUser;
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session save error on signup:", err);
        return res.sendStatus(500);
      }
      console.log("✅ SESSION AFTER SIGNUP:", req.session);
      res.json(newUser);
    });
  };
  

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const user = await dao.findUserByCredentials(username, password);
  
    if (user) {
      req.session.currentUser = user;
  
      // ✅ wait for session to save before responding
      req.session.save((err) => {
        if (err) {
          console.error("❌ Session save error:", err);
          return res.sendStatus(500);
        }
        console.log("✅ SESSION AFTER SIGNIN:", req.session);
        res.json(user);
      });
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  

  const signout = (req, res) => {
    req.session.destroy(); 
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    console.log("👤 PROFILE ROUTE SESSION:", req.session);
    if (!req.session.currentUser) {
      console.log("⚠️ No currentUser found in session.");
      return res.sendStatus(403);
    }
    res.json(req.session.currentUser);
  };
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session.currentUser;
      if (!currentUser) {
        return res.sendStatus(401);
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  


  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/current/courses", createCourse);
}
