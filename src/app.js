import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// route
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/admin", adminRoutes);

// health check
app.get("/", (req, res) => {
  res.send(`Welcome to the ${process.env.APP_NAME}`);
});

export default app;
