import { Application } from "express";
import authRoutes from "./auth.routes.js";
// import userRoutes from './user.routes.js';
// import postRoutes from './post.routes.js';
// import addressRoutes from './address.routes.js';
// import adminRoutes from './admin.routes.js';

export const registerRoutes = (app: Application): void => {
  // Health check
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use("/api/auth", authRoutes);
  // app.use('/api/users', userRoutes);
  // app.use('/api/posts', postRoutes);
  // app.use('/api/addresses', addressRoutes);
  // app.use('/api/admin', adminRoutes);

  // Root route
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Pick My Pit API v2",
      version: "2.0.0",
    });
  });

  // 404 handler
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });
};
