import * as dao from "./dao.js";
import model from "./model.js";
import mongoose from "mongoose";

export default function AssignmentRoutes(app) {
  app.post("/api/modules/:moduleId/assignments", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const assignment = { ...req.body, module: moduleId };
      const newAssignment = await dao.createAssignment(assignment);
  
      console.log("Created assignment:", newAssignment);
  
      res.send(newAssignment.toObject ? newAssignment.toObject() : newAssignment);
    } catch (err) {
      console.error("Error creating assignment:", err);
      res.status(500).send({ error: "Failed to create assignment" });
    }
  });
  

  app.get("/api/modules/:moduleId/assignments", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const assignments = await dao.findAssignmentsForModule(moduleId);
      console.log("🎯 Original assignments from DAO:", assignments);
      
      
      const processedAssignments = assignments.map(assignment => {
        if (!assignment._id) {
          console.error("⚠️ Assignment missing ID:", assignment);
        }
        return {
          ...assignment,
          _id: assignment._id
        };
      });
      
      console.log("📤 Final response assignments:", processedAssignments);
      res.json(processedAssignments);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      res.status(500).send({ error: "Failed to fetch assignments" });
    }
  });
  
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const updated = await dao.updateAssignment(assignmentId, req.body);
      res.send(updated);
    } catch (err) {
      console.error("Error updating assignment:", err);
      res.status(500).send({ error: "Failed to update assignment" });
    }
  });

  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const deleted = await dao.deleteAssignment(assignmentId);
      res.send(deleted);
    } catch (err) {
      console.error("Error deleting assignment:", err);
      res.status(500).send({ error: "Failed to delete assignment" });
    }
  });

  app.get("/api/courses/:courseId/assignments", async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsByCourse(courseId);
      console.log("Course assignments:", assignments); 
      res.send(assignments);
    } catch (err) {
      console.error("Error fetching assignments by course:", err);
      res.status(500).send({ error: "Failed to fetch assignments by course" });
    }
  });
  

  app.get("/api/modules/:moduleId/assignments/:assignmentId", async (req, res) => {
    try {
      const { moduleId, assignmentId } = req.params;
      const assignment = await dao.findAssignmentByIdAndModule(assignmentId, moduleId);
      if (!assignment) {
        return res.status(404).send({ error: "Assignment not found" });
      }
      res.send(assignment);
    } catch (err) {
      console.error("Error fetching specific assignment:", err);
      res.status(500).send({ error: "Failed to fetch assignment" });
    }
  });

  app.get("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const assignment = await dao.findAssignmentById(req.params.assignmentId); 
      if (!assignment) {
        return res.status(404).send({ error: "Assignment not found" });
      }
      res.send(assignment);
    } catch (err) {
      console.error("Error fetching assignment by ID:", err);
      res.status(500).send({ error: "Failed to fetch assignment" });
    }
  });
  app.get("/api/debug/assignments", async (req, res) => {
    const results = await model.find({ module: "M101" });
    res.json(results);
  });

  app.get("/api/debug/raw", async (req, res) => {
    const connection = mongoose.connection;
    const results = await connection.db.collection("assignments").find({ module: "M101" }).toArray();
    res.json(results);
  });
  
}

