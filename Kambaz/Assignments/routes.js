import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.post("/api/modules/:moduleId/assignments", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const assignment = { ...req.body, module: moduleId };
      const newAssignment = await dao.createAssignment(assignment);
  
      console.log("✅ Created assignment:", newAssignment);
  
      res.send(newAssignment.toObject ? newAssignment.toObject() : newAssignment);
    } catch (err) {
      console.error("❌ Error creating assignment:", err);
      res.status(500).send({ error: "Failed to create assignment" });
    }
  });
  

  app.get("/api/modules/:moduleId/assignments", async (req, res) => {
    try {
      const { moduleId } = req.params;
      const assignments = await dao.findAssignmentsForModule(moduleId);
      res.send(assignments);
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
      res.send(assignments);
    } catch (err) {
      console.error("Error fetching assignments by course:", err);
      res.status(500).send({ error: "Failed to fetch assignments by course" });
    }
  });
}

