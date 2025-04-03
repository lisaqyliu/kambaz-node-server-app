import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.get("/api/users/:userId/enrollments", (req, res) => {
    const { userId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  });
  app.post("/api/users/:userId/courses/:courseId", (req, res) => {
    const { userId, courseId } = req.params;
    const enrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });
  app.delete("/api/enrollments/:enrollmentId", (req, res) => {
    const { enrollmentId } = req.params;
    const result = enrollmentsDao.deleteEnrollment(enrollmentId);
    res.json(result);
  });
}
