import { v4 as uuidv4 } from "uuid";
import model from "./model.js"

export async function findAllCourses() {
  return await model.find();
}
export async function findCoursesForEnrolledUser(userId) {
    const enrollments = await EnrollmentModel.find({user: userId});
    const courseIds = enrollments.map((enrollment) => enrollment.course);
    const courses = await CourseModel.find({ _id: { $in: courseIds } })
    return courses;
}
export async function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return await model.create(newCourse);
}
export async function deleteCourse(courseId) {
    await model.findByIdAndDelete(courseId);
    return { status: "deleted" };
}
export async function updateCourse(courseId, courseUpdates) {
    const updatedCourse = await model.findByIdAndUpdate(courseId, courseUpdates, {
      new: true,
    });
    return updatedCourse;
}
  
  