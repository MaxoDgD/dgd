const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔌 CONEXIÓN A MYSQL (Railway)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.log("❌ Error conectando a DB:", err);
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

// ================= LOGIN =================
app.get("/login", (req, res) => {
  const { usuario, password } = req.query;

  if (!usuario || !password) {
    return res.send("DATOS_INCOMPLETOS");
  }

  db.query(
    "SELECT password FROM usuarios WHERE usuario = ?",
    [usuario],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send("ERROR");
      }

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

// ================= REGISTRO =================
app.get("/register", (req, res) => {
  const { usuario, password } = req.query;

  if (!usuario || !password) {
    return res.send("DATOS_INCOMPLETOS");
  }

  db.query(
    "SELECT id FROM usuarios WHERE usuario = ?",
    [usuario],
    (err, result) => {
      if (err) return res.send("ERROR");

      if (result.length > 0) {
        res.send("USUARIO_EXISTE");
      } else {
        db.query(
          "INSERT INTO usuarios (usuario, password) VALUES (?, ?)",
          [usuario, password],
          (err) => {
            if (err) return res.send("ERROR");
            res.send("REGISTRO_OK");
          }
        );
      }
    }
  );
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto " + PORT);
});
