import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: String,
  points: Number,
  course: { type: String, ref: "Course" }, 
}, { collection: "assignments" });

export default assignmentSchema;
