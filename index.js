const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const userRouter = require("./routes/user-router");
const blogRouter = require("./routes/blog-router");
const cors = require("cors");

const app = express();

// TODO: Update origin before production
app.use(
  cors({
    origin: "*",
  })
);

dotenv.config({ path: path.join(__dirname, "./.env") });

// parse json request body
app.use(express.json());

const port = process.env.PORT || 3500;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
  const baseUrl = process.env.BASE_URL;
  return res.render("home", { baseUrl });
});
// routes
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(`🌍 Base URL: ${process.env.BASE_URL}`);
});
