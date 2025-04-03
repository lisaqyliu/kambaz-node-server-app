import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments.push(newAssignment);
  return newAssignment;
}

export function findAssignmentsForModule(moduleId) {
  return Database.assignments.filter(a => a.module === moduleId);
}

export function updateAssignment(assignmentId, updates) {
  const assignment = Database.assignments.find(a => a._id === assignmentId);
  if (!assignment) return null;
  Object.assign(assignment, updates);
  return assignment;
}

export function deleteAssignment(assignmentId) {
  Database.assignments = Database.assignments.filter(a => a._id !== assignmentId);
  return { status: "deleted" };
}
