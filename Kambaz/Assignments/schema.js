import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    _id: { 
        type: String,
        required: true
    },
    title: String,
    description: String,
    dueDate: String,
    points: Number,
    course: { type: String, ref: "Course" },
    module: { type: String, ref: "Module" }
}, { 
    collection: "assignments",
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true }
});

export default assignmentSchema; 