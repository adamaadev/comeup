import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql';

// Configurer la connexion MySQL
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "comeup"
});
con.connect();

// Fonction de connexion
export function Signin(req, res) {
  const { email, password, type } = req.body.values;

  con.query("SELECT * FROM utilisateurs WHERE email = ? AND type = ?", [email, type], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send({ message: "Erreur de serveur" });
    }
    if (result.length === 0) {
      return res.status(404).send({ message: "Utilisateur non inscrit !" });
    } else {
      bcrypt.compare(password, result[0].password, (err, match) => {
        if (err) {
          console.error("Bcrypt comparison error:", err);
          return res.status(500).send({ message: "Erreur de serveur" });
        }
        if (match) {
          const { id, username, email, status, type } = result[0];
          const secret = type === "user" ? "token___user" : "token___admin";
          const token = jwt.sign({ id, username, email, status }, secret, { expiresIn: "14d" });
          const cookieName = type === "user" ? "token_user" : "token_admin";
          res.cookie(cookieName, token);
          return res.send({ success: true, id, email, status });
        } else {
          return res.status(401).send({ success: false, message: "Identifiants incorrects !" });
        }
      });
    }
  });
}

// Fonction d'inscription
export function SignUp(req, res) {
  const { username, email, password, type } = req.body.values;

  con.query("SELECT * FROM utilisateurs WHERE username = ?", [username], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send({ message: "Erreur de serveur" });
    }
    if (result.length > 0) {
      return res.send({ message: "Ce nom d'utilisateur existe déjà !" });
    } else {
      con.query("SELECT * FROM utilisateurs WHERE email = ?", [email], (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).send({ message: "Erreur de serveur" });
        }
        if (result.length > 0) {
          return res.send({ message: "Cet email existe déjà !" });
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              console.error("Bcrypt hash error:", err);
              return res.status(500).send({ message: "Erreur de serveur" });
            }
            con.query('INSERT INTO utilisateurs (username, email, password, status, type) VALUES (?, ?, ?, ?, ?)', [username, email, hash, "false", type], (err, result) => {
              if (err) {
                console.error("Database insert error:", err);
                return res.status(500).send({ message: "Erreur de serveur" });
              }
              return res.send({ success: true });
            });
          });
        }
      });
    }
  });
}
