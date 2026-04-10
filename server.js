const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔌 CONEXIÓN A MYSQL
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.log("❌ ERROR CONECTANDO DB:", err);
  } else {
    console.log("✅ DB CONECTADA");
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
        console.log("❌ SQL LOGIN:", err);
        return res.send(err.sqlMessage);
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
      if (err) {
        console.log("❌ SQL CHECK USER:", err);
        return res.send(err.sqlMessage);
      }

      if (result.length > 0) {
        res.send("USUARIO_EXISTE");
      } else {
        db.query(
          "INSERT INTO usuarios (usuario, password) VALUES (?, ?)",
          [usuario, password],
          (err) => {
            if (err) {
              console.log("❌ SQL INSERT:", err);
              return res.send(err.sqlMessage);
            }

            res.send("REGISTRO_OK");
          }
        );
      }
    }
  );
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log("🚀 Servidor corriendo en puerto " + PORT);
});
