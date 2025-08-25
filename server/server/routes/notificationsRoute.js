const router = require("express").Router();
const Notification = require("../models/notificationsModel");
const authMiddleware = require("../middlewares/authMiddleware");

// Add a notification
router.post("/add-notification", authMiddleware, async (req, res) => {
  try {
    const { title, description, onClick } = req.body;

    if (!title || !description || !onClick) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and onClick are required",
      });
    }

    const newNotification = new Notification({
      user: req.user.id, // safer than req.body.userId
      title,
      description,
      onClick,
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      data: newNotification,
      message: "Notification added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add notification",
      error: error.message,
    });
  }
});

// Get all notifications for logged-in user
router.get("/get-all-notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

// Mark all notifications as read
router.post("/mark-as-read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Notifications marked as read",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: error.message,
    });
  }
});

// Delete all notifications
router.delete("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: "All notifications deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notifications",
      error: error.message,
    });
  }
});

module.exports = router;
