require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");
const twofactorauth = require("./routes/2FAroutes");
require("./config/passport");

const authRoutes = require("./routes/auth");
const client = process.env.CLIENT_URL;

const app = express();
app.use(
  cors({
    origin: client,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/api/auth", authRoutes);
app.use("/api/2fa", twofactorauth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
