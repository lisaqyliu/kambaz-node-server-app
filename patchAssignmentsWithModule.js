import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URI = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

mongoose.connect(DB_URI)
  .then(() => console.log(`Connected to ${DB_URI}`))
  .catch((err) => console.error("MongoDB connection error:", err));

  const assignmentSchema = new mongoose.Schema(
    {
      _id: String,
      course: String,
      module: String,  // ← FIX: use String, not ObjectId
    },
    { strict: false }
  );
  

  const moduleSchema = new mongoose.Schema(
    {
      _id: String,      // ← FIX: ensure _id is treated as String
      course: String,
    },
    { strict: false }
  );
  

const Assignment = mongoose.model("Assignment", assignmentSchema, "assignments");
const Module = mongoose.model("Module", moduleSchema, "modules");

(async () => {
  const assignments = await Assignment.find({
    module: { $exists: false },
    course: { $exists: true }
  });

  let fixedCount = 0;

  for (const a of assignments) {
    const module = await Module.findOne({ course: a.course });
    if (module) {
      a.module = module._id;
      await a.save();
      fixedCount++;
    } else {
      console.warn(`⚠️ No module found for course: ${a.course}`);
    }
  }

  console.log(`Fixed ${fixedCount} assignments.`);
  mongoose.disconnect();
})();
