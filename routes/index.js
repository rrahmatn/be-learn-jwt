const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("../bin/connection");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("sudah berjalan")
  console.log("database sudah siap digunakan");
});

module.exports = app;
