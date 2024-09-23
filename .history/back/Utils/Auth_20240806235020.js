import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from "mysql";

const con = mysql.createConnection({ host: "localhost", user: "root", password: "", database: "comeup" });
con.connect();

export default function Signin(req, res) {
  const { email, password, type } = req.body.values;
  con.query("SELECT * FROM utilisateurs WHERE email = ? AND type = ?", [email, type], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Erreur de serveur" });
    }
    if (result.length === 0) {
      return res.send({ message: "Utilisateur non inscrit !" });
    } else {
      bcrypt.compare(password, result[0].password, (err, match) => {
        if (err) {
          return res.status(500).send({ message: "Erreur de serveur" });
        }
        if (match) {
          const { id, username, email, status, type } = result[0];
          if (type === "user") {
            const token = jwt.sign({ id, username, email, status }, "token___user", { expiresIn: "14d" });
            res.cookie("token_user", token); 
          } else {
            const token = jwt.sign({ id, username, email, status }, "token___admin", { expiresIn: "14d" });
            res.cookie("token_admin", token); 
          }
          return res.send({ success: true, id, email, status });
        } else {
          return res.send({ success: false, message: "Identifiants incorrects !" });
        }
      });
    }
  }
 );
}

export default function SignUp (req, res){
        const { username, email, password , type } = req.body.values;
        con.query("SELECT * FROM utilisateurs WHERE username = ?", [username], (err, result) => {
          if (result.length > 0) {
            res.send({message : "Ce nom d'utilisateur existe deja !"});
          } else {
            con.query("SELECT * FROM utilisateurs WHERE email = ?", [email], (err, result) => {
              if (result.length > 0) {
                res.send({message : "Cet email existe deja !"});
              } else {
                bcrypt.hash(password, 10, (err, hash) => {
                  if (err) {
                    res.send(err);
                  } else {
                    console.log(username, email, password , type);
                    
                    con.query('INSERT INTO utilisateurs VALUES (?, ?, ?, ?, ?, ?)', [null, username, email, hash, "false", type], (err, success) => {
                      if (success) {
                        res.send({ success: true });
                      }
                    });
                  }
                });
              }
            });
          }
        }
    );
}