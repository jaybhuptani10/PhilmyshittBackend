import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: ["https://cinevaultt.vercel.app", "http://localhost:5173"],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
import fetchRouter from "./routes/fetch.routes.js";
import userRouter from "./routes/user.routes.js";

//ROutes Decalarion

app.use("/api", fetchRouter);
app.use("/user", userRouter);
app.use("/", (req, res) => {
  res.json("Hell");
});

export default app;
