const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Log requests only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Database config
require("./config/dbConfig");

// Routes
const usersRoute = require("./routes/usersRoute");
const projectsRoute = require("./routes/projectsRoute");
const tasksRoute = require("./routes/tasksRoute");
const notificationsRoute = require("./routes/notificationsRoute");

app.use("/api/users", usersRoute);
app.use("/api/projects", projectsRoute);
app.use("/api/tasks", tasksRoute);
app.use("/api/notifications", notificationsRoute);

// Production setup
const rootDir = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "client", "build", "index.html"));
  });
} else {
  // Optional: Handle unmatched routes in development
  app.use((req, res) => {
    res.status(404).json({ success: false, message: "API route not found" });
  });
}

const port = process.env.PORT || 5000;

// Global error handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // optional: restart app using PM2 or similar
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${port}`);
});
