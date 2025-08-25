const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // match your user model export name
      required: [true, "User ID is required"],
      index: true, // makes lookups faster
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Notification description is required"],
      trim: true,
    },
    onClick: {
      type: String,
      required: [true, "Notification action (onClick) is required"],
      trim: true,
      // If you have specific actions, uncomment this:
      // enum: ["openOrders", "openProfile", "openMessages"]
    },
    read: {
      type: Boolean,
      default: false,
      index: true, // fast filtering unread/read
    },
  },
  {
    timestamps: true,
  }
);

// Export with singular name for consistency
module.exports = mongoose.model("Notification", notificationsSchema);
