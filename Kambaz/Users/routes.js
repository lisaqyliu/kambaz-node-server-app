import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


export default function UserRoutes(app) {
  const createUser = async (req, res) => { 
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
   };

  const deleteUser = async (req, res) => { 
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
   };

  const findAllUsers = async (req, res) => {
    const {role, name} = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if ( name ) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => { 
    const user = await dao.findUserById(req.params.userId);
    if (!user) {
      return res.sendStatus(404);
    }
    res.json(user);
   };

   const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
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
    console.log("🛂 Attempting signin for:", username, password);
  
    const user = await dao.findUserByCredentials(username, password);
    console.log("🔍 Found user:", user);
  
    if (user) {
      req.session.currentUser = user;
      req.session.save((err) => {
        if (err) {
          console.error("❌ Session save error:", err);
          return res.sendStatus(500);
        }
        console.log("✅ SESSION AFTER SIGNIN:", req.session);
        res.json(user);
      });
    } else {
      console.warn("🚫 Invalid credentials!");
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
    const courses = await courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = async(req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = await courseDao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };
  
  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) return res.sendStatus(401);
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
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
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);

}
