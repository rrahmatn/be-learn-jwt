const express = require("express");
const app = express();
const www = require("./bin/www");
const db = require("./bin/connection");
const bodyParser = require("body-parser");
const getUsers = require("./routes/users")
const index = require("./routes/index")
const cors = require('cors');

app.use(bodyParser.json());



app.use(cors())
app.use(index)
app.use(getUsers)
app.listen(www);
