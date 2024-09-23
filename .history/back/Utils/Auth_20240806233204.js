import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import './Config.js';

export default function Signin(req, res) {
  const { email, password, type } = req.body.values;

  // Vérifiez si les paramètres requis sont présents
  if (!email || !password || !type) {
    return res.status(400).send({ message: "Paramètres manquants" });
  }

  con.query("SELECT * FROM utilisateurs WHERE email = ? AND type = ?", [email, type], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send({ message: "Erreur de serveur lors de la requête" });
    }

    if (result.length === 0) {
      return res.status(404).send({ message: "Utilisateur non inscrit !" });
    }

    bcrypt.compare(password, result[0].password, (err, match) => {
      if (err) {
        console.error("Bcrypt comparison error:", err);
        return res.status(500).send({ message: "Erreur de serveur lors de la comparaison des mots de passe" });
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
  });
}
