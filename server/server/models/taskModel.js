const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false } // don't need separate _id for subdocuments
);

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "archived"],
      default: "pending",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
      required: [true, "Project reference is required"],
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false, // set to true if assignment is mandatory
      index: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false, // set to true if needed
      index: true
    },
    attachments: {
      type: [attachmentSchema],
      default: []
    },
  },
  { timestamps: true }
);

// Optional compound index for searching tasks by project and status quickly
taskSchema.index({ project: 1, status: 1 });

module.exports = mongoose.model("tasks", taskSchema);
