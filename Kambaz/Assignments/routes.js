import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.post("/api/modules/:moduleId/assignments", (req, res) => {
    const { moduleId } = req.params;
    const assignment = { ...req.body, module: moduleId };
    const newAssignment = dao.createAssignment(assignment);
    res.send(newAssignment);
  });

  app.get("/api/modules/:moduleId/assignments", (req, res) => {
    const { moduleId } = req.params;
    const assignments = dao.findAssignmentsForModule(moduleId);
    res.send(assignments);
  });

  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.updateAssignment(assignmentId, req.body);
    res.send(status);
  });

  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    res.send(status);
  });
}
