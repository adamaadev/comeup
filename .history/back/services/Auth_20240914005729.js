import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import con from './db.js';

export function CheckUser(req, res, next) {
  const { type } = req.body;

  const tokenKey = type === 'admin' ? 'token_admin' : 'token_user';
  const secretKey = type === 'admin' ? "token___admin" : "token___user";

  const token = req.cookies[tokenKey];

  if (!token) {
    return res.send({ success: false, message: "Vous n'êtes pas connecté" });
  } 

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.send({ success: false, message: "Erreur lors de la vérification du token" });
    }

    req.id = decoded.id;
    req.username = decoded.username;
    req.email = decoded.email;
    req.essaie = decoded.essaie;
    req.status = decoded.status;

    if (type === 'user') {
      req.type = decoded.type;
      req.carte = decoded.carte;
      req.date_debut = decoded.date_debut;
      req.date_fin = decoded.date_fin;
      req.plan = decoded.plan;
    }

    next();
  });
};

export function Signin(req, res) {
  const { email, password, type } = req.body.values;

  con.query("SELECT * FROM utilisateurs WHERE email = ? AND type = ?", [email, type], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Erreur de serveur" });
    }

    if (result.length === 0) {
      return res.send({ message: "Utilisateur non inscrit !" });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        return res.status(500).send({ message: "Erreur de serveur" });
      }

      if (match) {
        const { id, username, email, essaie, status, type, carte, date_debut, date_fin, plan } = user;
        let token;

        if (type === "user") {
          token = jwt.sign({ id, username, email, essaie, status, type, carte, date_debut, date_fin, plan }, "token___user", { expiresIn: "6d" });
          res.cookie("token_user", token);
          return res.send({ success: true, id, username, email, essaie, status, type, carte, date_debut, date_fin, plan });
        } else {
          token = jwt.sign({ id, username, email, essaie, status }, "token___admin", { expiresIn: "6d" });
          res.cookie("token_admin", token);
          return res.send({ success: true, id, username, email, essaie, status });
        }
      } else {
        return res.send({ success: false, message: "Identifiants incorrects !" });
      }
    });
  });
}


export function SignUp (req, res){
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
                    
                    con.query('INSERT INTO utilisateurs (id, username, email, password, essaie, status, type, carte, date_debut, date_fin, plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [null, username, email, hash, "false", "inactive", type, 0, 0,0, "aucun"], (err, success) => {
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

export function CheckPassword (req,res){
  const { email, password1 } = req.body;
  con.query('SELECT * FROM utilisateurs WHERE email = ?',[email],(err,result)=>{
    if (result.length > 0) {
      bcrypt.compare(password1, result[0].password, (err, match) => {
          if (match) {
            res.send({exist : true})
          }else{
            res.send({exist : false})
          }
       } 
     )
    }
  })
}

export function ChangePassword (req, res) {
  const { email, password2 } = req.body;
  bcrypt.hash(password2, 10, (err, hash) => {
    con.query('UPDATE utilisateurs SET password = ? WHERE email = ?', [hash, email], (error, result) => {
        if (error) {
           res.send({ success: false });
        }else{
          res.send({ success: true });
        }
        });
      });
  } 

export function Forget (req , res){
  con.query('SELECT * FROM utilisateurs WHERE email = ?', req.body.email, (err, result) => {
    if(result.length > 0 ){
      res.send({ message: true });
    } else {
      res.send({ message: false });
    }
  });
}

export function Logout(req, res){
  if (req.body.type === "admin") {
    res.clearCookie('token_admin');
  }else{
    res.clearCookie('token_user');
  }
  return res.send({success : true})
}