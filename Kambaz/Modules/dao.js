import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
export function createModule(module) {
    const newModule = { ...module, _id: uuidv4(), lessons: [] };
    Database.modules.push(newModule);
    console.log("✅ Creating Module:", newModule);
    console.log("📦 Current Database.modules:", Database.modules);

    return newModule;
}
export function deleteModule(moduleId) {
    const { modules } = Database;
    Database.modules = modules.filter((module) => module._id !== moduleId);
}   
  
export function findModulesForCourse(courseId) {
  const { modules } = Database;
  return modules.filter((module) => module.course === courseId);
}
export function updateModule(moduleId, moduleUpdates) {
    const { modules } = Database;
    const module = modules.find((m) => m._id === moduleId);
    if (!module) {
      console.error(`❌ Module with ID ${moduleId} not found`);
      return null; // Add this check to avoid Object.assign crash
    }
    console.log("🔄 Trying to update module ID:", moduleId);
    console.log("📦 Database.modules has:", Database.modules.map((m) => m._id));

    Object.assign(module, moduleUpdates);
    return module;
  }
  
  