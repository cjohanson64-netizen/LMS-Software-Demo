import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import meRouter from "./routes/me.js";
import coursesRouter from "./routes/courses.js";
import submissionsRouter from "./routes/submissions.js";
import assignmentsRouter from "./routes/assignments.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/courses", coursesRouter);
app.use("/", submissionsRouter);
app.use("/assignments", assignmentsRouter);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
