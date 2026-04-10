const express = require("express");
const mysql = require("mysql2");
const app = express();

const PORT = process.env.PORT || 3000;

// 🔌 CONFIGURA TU BASE DE DATOS AQUÍ
const db = mysql.createConnection({
  host: "TU_HOST",
  user: "TU_USUARIO",
  password: "TU_PASSWORD",
  database: "juegodb"
});

db.connect(err => {
  if (err) console.log("Error DB:", err);
  else console.log("Conectado a DB");
});

// LOGIN
app.get("/login", (req, res) => {
  const { usuario, password } = req.query;

  if (!usuario || !password) {
    return res.send("DATOS_INCOMPLETOS");
  }

  db.query(
    "SELECT password FROM usuarios WHERE usuario = ?",
    [usuario],
    (err, result) => {
      if (err) return res.send("ERROR");

      if (result.length > 0) {
        if (result[0].password === password) {
          res.send("OK");
        } else {
          res.send("ERROR_PASSWORD");
        }
      } else {
        res.send("USUARIO_NO_EXISTE");
      }
    }
  );
});

// REGISTRO
app.get("/register", (req, res) => {
  const { usuario, password } = req.query;

  if (!usuario || !password) {
    return res.send("DATOS_INCOMPLETOS");
  }

  db.query(
    "SELECT id FROM usuarios WHERE usuario = ?",
    [usuario],
    (err, result) => {
      if (result.length > 0) {
        res.send("USUARIO_EXISTE");
      } else {
        db.query(
          "INSERT INTO usuarios (usuario, password) VALUES (?, ?)",
          [usuario, password],
          () => {
            res.send("REGISTRO_OK");
          }
        );
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});