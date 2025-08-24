const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Member must be associated with a user"],
  },
  role: {
    type: String,
    required: [true, "Role is required for each member"],
    enum: ["viewer", "editor", "admin"], // restrict roles to known values
    default: "viewer",
  },
}, { _id: false }); // disable automatic _id for subdocuments if not needed

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [3, "Project name must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "archived", "pending"],
      default: "active",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Project must have an owner"],
      index: true, // query optimization for owner-based lookups
    },
    members: {
      type: [memberSchema],
      validate: {
        validator: function (members) {
          // prevent duplicate user entries in members
          const userIds = members.map(m => m.user.toString());
          return userIds.length === new Set(userIds).size;
        },
        message: "Duplicate users are not allowed in members list",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false, // remove __v field
  }
);

module.exports = mongoose.model("projects", projectSchema);
