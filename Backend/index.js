const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const errorHandler = require("./Middleware/errorHandler.js");
const connectDB = require("./Config/db");
const { User, Profile } = require("./Models/associations");

// Load environment variables
dotenv.config();

// Initialize Express App
app.use(
  cors({
    origin: [
      "http://localhost:5173", // أثناء التطوير
      "https://storsheshine.vercel.app", // production
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  },
});

// Make io accessible to our router
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
// ✅ Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Import Routes
const userRoutes = require("./Routing/User/user.Routes.js");
const authRoutes = require("./Routing/User/auth.Routes.js");
const profileRoutes = require("./Routing/User/Profile.Routes.js");
const employeeRoutes = require("./Routing/User/Employee.Routes.js");
const productRoutes = require("./Routing/Products/Products.Routes.js");
const uploadRoutes = require("./Routing/uploadRoutes.js");

// API Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the SheShine API!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

// 🏥 Health Check Endpoint
app.get("/api/health", (req, res) => {
  const state = mongoose.connection.readyState;
  const status = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.json({ status: status[state] || "unknown", state });
});

const PORT = process.env.PORT || 9000;

// Function to start the server
(async () => {
  // Add a JWT_SECRET to your .env file!
  if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1);
  }
  try {
    // 1. Authenticate the database connection
    await connectDB(); // connectDB already logs this

    // ✅ Seed Default Admin
    const adminEmail = "Eslam@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const adminProfile = await Profile.create({
        Address: "Admin HQ",
        DOB: new Date("1990-01-01"),
      });

      const adminUser = await User.create({
        name: "Eslam Saeed",
        email: adminEmail,
        password: "123456", // Will be hashed by pre-save hook
        role: "admin",
        profile: adminProfile._id,
      });

      adminProfile.user = adminUser._id;
      await adminProfile.save();
      console.log("👤 Default Admin Created: Eslam Saeed");
    }

    // 3. Start the Express server
    server.listen(PORT, () => {
      console.log(
        `🚀 Server with Socket.IO running on http://localhost:${PORT}`,
      );
    });
  } catch (err) {
    console.error("❌ Unable to start the server:", err);
    process.exit(1); // Exit the process with an error code
  }
})();

// Global Error Handler (must be last middleware)
app.use(errorHandler);
