import model from "./model.js";

export const createAssignment = async (assignment) => {
  const properAssignment = {
    ...assignment,
    module: new mongoose.Types.ObjectId(assignment.module),
  };
  const created = await model.create(properAssignment);
  return created.toObject();
};


export const findAssignmentsForModule = async (moduleId) => {
  return await model.find({ module: new mongoose.Types.ObjectId(moduleId) });
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


