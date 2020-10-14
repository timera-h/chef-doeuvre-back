require("dotenv").config();
require("./config/mongo");
require("./config/cloudinary");


const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// POST SETUP
app.use(express.json());

// CORS SETUP
app.use(cors(["http://localhost:3000", "http://localhost:8080"]));

// API CALL LOGGIN
app.use(morgan("dev"));

// SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    saveUninitialized: true,
    resave: false,
  })
);

app.get("/", (req, res) => res.send("hello :) my api is working"));

app.use("/api/products", require("./routes/api.products"));
app.use("/api/users", require("./routes/api.users"));
app.use("/api/auth", require("./routes/api.auth"));
app.use("/api/categories", require("./routes/api.categories"));
app.use("/api/orders", require("./routes/api.orders"));
app.use("/api/favorites", require("./routes/api.favorites"));
app.use("/api/payements", require("./routes/api.payements"));


module.exports = app;
