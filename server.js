const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Enable CORS for development
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect Database
// connectDB();

// Init Middleware
app.use(express.json());

// Add request logging middleware for development
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Define Routes
app.use("/api/users", require("./server/routes/api/users"));
app.use("/api/auth", require("./server/routes/api/auth"));
app.use("/api/profile", require("./server/routes/api/profile"));
app.use("/api/posts", require("./server/routes/api/posts"));
app.use("/api/notes", require("./server/routes/api/notes"));
console.log("API routes registered");

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5025;
const HOST = "0.0.0.0"; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server started on ${HOST}:${PORT}`);
  console.log(`Development API URLs:`);
  console.log(`- http://localhost:${PORT}`);
  console.log(`- http://127.0.0.1:${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
