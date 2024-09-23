import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import con from './db.js';

export function CheckUser(req, res, next) {
  const { type } = req.body;
  if (type === 'admin') {
    const token1 = req.cookies.token_admin;
    if (!token1) {
      return res.send({ success : false , Message: "vous n'etes pas connectés" });
    } else {
      jwt.verify(token1, "token___admin", (err, decoded) => {
        if (err) {
          return res.send({ Message: "Erreur" });
        } else {
          req.id = decoded.id;
          req.username = decoded.username;
          req.email = decoded.email;
          next();
        }
      });
    } 
  }else{
    const token = req.cookies.token_user;
    if (!token) {
      return res.send({ success : false , Message: "vous n'etes pas connectés" });
    } else {
      jwt.verify(token, "token___user", (err, decoded) => {
        if (err) {
          return res.send({ Message: "Erreur" });
        } else {
            req.id = decoded.id;
            req.username = decoded.username;
            req.email = decoded.email;
            req.essaie = decoded.essaie;
            req.status = decoded.status;
            next();
        }
      });
    }
  }
};

export function Signin(req, res) {
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
          const { id, username, email, type , essaie , status } = result[0];
          
          if (type === "user") {
            const token = jwt.sign({ id, username, email , essaie , status }, "token___user", { expiresIn: "6d" });
            res.cookie("token_user", token); 
          } else {
            const token = jwt.sign({ id, username, email , essaie , status }, "token___admin", { expiresIn: "6d" });
            res.cookie("token_admin", token); 
          }
          return res.send({ success: true, id, email , essaie , status});
        } else {
          return res.send({ success: false, message: "Identifiants incorrects !" });
        }
      });
    }
  }
 );
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