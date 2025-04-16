import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export async function createModule(module) {
  const newModule = { ...module, _id: uuidv4(), lessons: [] };
  const savedModule = await model.create(newModule);
  console.log("Created Module:", savedModule);
  return savedModule;
}

export async function deleteModule(moduleId) {
  await model.deleteOne({ _id: moduleId });
  return { status: "deleted" };
}   
  
export async function findModulesForCourse(courseId) {
  return await model.find({ course: courseId });
}

export async function updateModule(moduleId, moduleUpdates) {
  const updatedModule = await model.findByIdAndUpdate(
    moduleId,
    moduleUpdates,
    { new: true }
  );
  return updatedModule;
}
  
  