import model from "./model.js";
import mongoose from "mongoose";

export const createAssignment = async (assignment) => {
  try {
    
    if (!assignment._id) {
      assignment._id = `A${assignment.module.substring(1)}${Math.floor(Math.random() * 900) + 100}`;
      console.log("Generated assignment ID:", assignment._id);
    }

    const created = await model.create(assignment);
    console.log(" Created assignment:", created);
    return created.toObject();
  } catch (error) {
    console.error(" Error creating assignment:", error);
    throw error;
  }
};

export const findAssignmentsForModule = async (moduleId) => {
  try {
    const results = await model.find({ module: moduleId });
    console.log("📦 Raw MongoDB results:", JSON.stringify(results, null, 2));

    const assignments = results.map(doc => {
      const plainDoc = doc.toObject();
      console.log("🔍 Processing assignment:", plainDoc);
      
      // Ensure _id exists and is a string
      if (!plainDoc._id) {
        console.warn("⚠️ Assignment missing ID:", plainDoc);
        plainDoc._id = `A${moduleId.substring(1)}${Math.floor(Math.random() * 900) + 100}`;
      }

      return {
        ...plainDoc,
        _id: plainDoc._id.toString() // Ensure ID is string
      };
    });

    console.log("Processed assignments:", assignments);
    return assignments;
  } catch (error) {
    console.error(" Error in findAssignmentsForModule:", error);
    throw error;
  }
};

export const findAssignmentByIdAndModule = async (assignmentId, moduleId) => {
  try {
    const result = await model.findOne({
      _id: assignmentId,
      module: moduleId,
    });

    if (!result) return null;

    const assignment = result.toObject();
    return {
      ...assignment,
      _id: assignment._id.toString()
    };
  } catch (error) {
    console.error("Error finding assignment:", error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, updates) => {
  try {
    const updated = await model.findByIdAndUpdate(
      assignmentId,
      { ...updates, _id: assignmentId }, // Ensure ID isn't changed
      { new: true }
    );
    return updated ? updated.toObject() : null;
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    const deleted = await model.findByIdAndDelete(assignmentId);
    return deleted ? deleted.toObject() : null;
  } catch (error) {
    console.error("Error deleting assignment:", error);
    throw error;
  }
};

export const findAssignmentsByCourse = async (courseId) => {
  try {
    const results = await model.find({ course: courseId });
    return results.map(doc => {
      const assignment = doc.toObject();
      return {
        ...assignment,
        _id: assignment._id.toString()
      };
    });
  } catch (error) {
    console.error("Error finding course assignments:", error);
    throw error;
  }
}; 