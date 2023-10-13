var express = require("express");
var app = express();
const db = require("../bin/connection");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const response = require("../bin/response");

app.use(bodyParser.json());

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (error, result) => {
    if (error) {
      // Tangani kesalahan kueri basis data
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      response(200, result , "Menampilkan seluruh mahasiswa", res);;
    }
  });
});

app.post("/ceknim", (req, res) => {
  const nim = req.body.nim;
  const checkNimQuery = `SELECT * FROM users WHERE nim = ${nim}`;
  db.query(checkNimQuery, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send("internal server error");
    } else if (result.length > 0) {
      console.log("nim sudah terpakai");
      response(400, result , "Nim sudah ada", res);
    } else {
      console.log("nim dapat digunakan")
      response(200, result , "Nim Dapat Digunakan", res);
    }
  });
});

// midleware ketersediaan nim dan email
const check = (req, res, next) => {
  const { email } = req.body;
  const checkEmailQuery = `SELECT * FROM users WHERE email = '${email}'`;
  // check nim

  db.query(checkEmailQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else if (results.length > 0) {
      console.log("Email sudah digunakan");
      res.status(400).send("Email sudah digunakan");
    } else {
      next();
    }
  });
};

//register
app.post("/users", check, async (req, res) => {
  const { nim, name, password, confirmPassword, email } = req.body;
  console.log(req.body);
  const hashedPassword = bcrypt.hashSync(password, 10);

  //check pasword sudah cocok
  const match = await bcrypt.compare(confirmPassword, hashedPassword);

  if (match) {
    const sql = `INSERT INTO users (id, nim, name, email, password, token) VALUES (NULL, ${nim}, '${name}', '${email}', '${hashedPassword}', '')`;

    db.query(sql, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(result)
        response(200, result, "selesai menambahkan users", res);
      }
    });
  } else {
    console.log("password tidak sesuai");
    res.status(400).send("Password tidak sesuai");
  }
});

// hapus user berdasarkan nim
app.delete("/users/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `DELETE FROM users WHERE nim = ${nim}`;

  db.query(sql, (error, result) => {
    if (error) console.error(error);
    console.log("berhasil menghapus users dengan nim : ", nim);
    res.send(`berhasil menghapus users dengan nim : ${nim}`);
  });
});
module.exports = app;
