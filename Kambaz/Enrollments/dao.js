import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findEnrollmentsForUser(userId) {
    const { enrollments } = Database;
    return enrollments.filter((enrollment) => enrollment.user === userId);
  }
  

export function enrollUserInCourse(userId, courseId) {
  const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
  Database.enrollments.push(newEnrollment);
  return newEnrollment;
}

export function deleteEnrollmentByUserAndCourse(userId, courseId) {
  const { enrollments } = Database;
  Database.enrollments = enrollments.filter(
    (e) => !(e.user === userId && e.course === courseId)
  );
  return { status: "deleted" };
}
