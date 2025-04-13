import model from "./model.js";  

// Get all courses a user is enrolled in (with full course details)
export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
}

// Get all users enrolled in a course (with full user details)
export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
}

// Enroll a user in a course (primary key is `${user}-${course}`)
export function enrollUserInCourse(user, course) {
  return model.create({ user, course, _id: `${user}-${course}` });
}

// Remove a user from a course
export function unenrollUserFromCourse(user, course) {
  return model.deleteOne({ user, course });
}
