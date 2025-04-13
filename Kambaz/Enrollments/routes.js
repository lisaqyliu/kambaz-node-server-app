import * as enrollmentsDao from "./dao.js";
import * as courseDao from "../Courses/dao.js"; 
export default function EnrollmentRoutes(app) {
  const findCoursesForUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    // Admin sees all courses
    if (currentUser.role === "ADMIN") {
      const courses = await courseDao.findAllCourses();
      res.json(courses);
      return;
    }

    // Otherwise return enrolled courses
    let { uid } = req.params;
    if (uid === "current") {
      uid = currentUser._id;
    }

    const courses = await enrollmentsDao.findCoursesForUser(uid);
    res.json(courses);
  };

  const enrollUser = async (req, res) => {
    const { userId, courseId } = req.params;
    const enrollment = await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  };

  const unenrollUser = async (req, res) => {
    const { userId, courseId } = req.params;
    const result = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.json(result);
  };

  app.get("/api/users/:uid/courses", findCoursesForUser);
  app.post("/api/users/:userId/courses/:courseId", enrollUser);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUser);
}
