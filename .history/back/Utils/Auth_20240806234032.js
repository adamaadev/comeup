import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
  });
}
