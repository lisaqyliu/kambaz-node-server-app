import model from "./model.js";

export const createAssignment = async (assignment) => {
  const created = await model.create(assignment);
  return created.toObject(); 
};


export const findAssignmentsForModule = async (moduleId) => {
  return await model.find({ module: moduleId });
};

export const updateAssignment = async (assignmentId, updates) => {
  return await model.findByIdAndUpdate(assignmentId, updates, { new: true });
};

export const deleteAssignment = async (assignmentId) => {
  return await model.findByIdAndDelete(assignmentId);
};

export const findAssignmentsByCourse = async (courseId) => {
  return await model.find({ course: courseId });
};


