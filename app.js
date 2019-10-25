const express = require("express");
const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const petsRoutes = require("./api/routes/pets");

mongoose
  .connect(
    "mongodb://apishoop:" +
      process.env.MONGO_ATLAS_PW +
      "@development-shard-00-00-yjbvs.mongodb.net:27017,development-shard-00-01-yjbvs.mongodb.net:27017,development-shard-00-02-yjbvs.mongodb.net:27017/pets?ssl=true&replicaSet=Development-shard-0&authSource=admin&retryWrites=true",
    { autoIndex: false }
  )
  .then(
    () => {
      console.log("Got it, connected with mongodb atlas!!");
    },
    err => {
      console.log(err);
    }
  );

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS errors control
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/pets", petsRoutes);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
