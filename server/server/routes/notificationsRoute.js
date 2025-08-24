const router = require("express").Router();
const Notification = require("../models/notificationsModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Add a new notification
router.post("/add-notification", authMiddleware, async (req, res) => {
  try {
    const { title, message, userId } = req.body;

    // Basic validation
    if (!title || !message || !userId) {
      return res.status(400).send({
        success: false,
        message: "Title, message, and userId are required",
      });
    }

    const newNotification = new Notification({
      title,
      message,
      userId,
      ...req.body, // allows extra optional fields if needed
    });

    await newNotification.save();

    return res.status(201).send({
      success: true,
      data: newNotification,
      message: "Notification added successfully",
    });
  } catch (error) {
    console.error("Error adding notification:", error.message); // optional logging
    return res.status(500).send({
      success: false,
      message: "Failed to add notification",
      error: error.message,
    });
  }
});

module.exports = router;
