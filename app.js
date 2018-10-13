const Users = require("./routes/users");
const Login = require("./routes/login");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => console.log("connected to db"))
  .catch(err => console.error("error", err));

app.use(express.json());
app.use(cors());
app.use("/users", Users);
app.use("/login", Login);
app.use("/uploads/images", express.static("uploads/images"));
const port = 5000 || process.env.PORT;
exports.port = port;
app.listen(port, () => console.log(`server running on port ${port}`));
