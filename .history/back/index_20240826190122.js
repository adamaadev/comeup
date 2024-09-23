import express from "express";
import cors from "cors";
import bodyparser from 'body-parser';
import cookieParser from "cookie-parser";
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { Signin , SignUp , CheckUser, ChangePassword, Forget, Logout, CheckPassword } from "./services/Auth.js";
import { AddCompany, checkcompany, deletecompany, ListCompanies, Watchlist } from "./services/Watchlist.js";
import { getFilterOptions, ListCompany, screener, search } from "./services/Screener.js";
import { Listanalyse, sendforce, sendrisque , deleteanalyse} from "./services/Analyse.js";
import { checkscore, getExistingQuestions, resetQuestions, sendquestion, updateQuestion } from "./services/Question.js";
import { Email, getusers } from "./services/Sendgrid.js";
import con from "./services/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.json());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));

app.post("/", CheckUser, (req, res) => {
  return res.send({ success: true, id : req.id , username: req.username, email: req.email , status : req.status });
});


app.post('/signin', Signin);

app.post('/signup', SignUp);

app.post('/checkpassword', CheckPassword);

app.post('/changepassword', ChangePassword);

app.post('/sendemail', Email);

app.post('/addcompany', AddCompany);

app.get('/listcompanies', ListCompanies);

app.post('/listcompany', ListCompany);

app.post('/checkcompany', checkcompany);

app.get('/screener', screener);

app.get('/filter-options', getFilterOptions)

app.post('/watchlist', Watchlist);

app.post('/deletecompany', deletecompany);

app.get('/search',search);

app.post('/sendforce',sendforce);

app.post('/sendrisque',sendrisque);

app.post('/listanalyse',Listanalyse);

app.post('/deleteanalyse',deleteanalyse);

app.post('/sendquestion',sendquestion);

app.post('/getExistingQuestions',getExistingQuestions);

app.post('/updateQuestion',updateQuestion);

app.post('/resetquestions',resetQuestions)

app.post('/checkscore',checkscore)

app.post('/douve/add', (req, res) => {
  const { symbol, reponse, justification, id_user } = req.body;

  const query = `INSERT INTO douve (symbol, reponse, justification, id_user) VALUES (?, ?, ?, ?)`;

  con.query(query, [symbol, reponse, justification, id_user], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error adding douve');
      }
      res.status(200).send('Douve added successfully');
  });
});

// Route to list all records
app.post('/douve/list', (req, res) => {
  const query = `SELECT * FROM douve WHERE symbol = ? AND id_user = ?`;

  con.query(query,[req.body.symbol,req.body.id] ,(err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error listing douve');
      }
      res.status(200).json(results);
  });
});

// Route to delete a record by ID
app.delete('/douve/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM douve WHERE id = ?`;

  con.query(query, [id], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error deleting douve');
      }
      res.status(200).send('Douve deleted successfully');
  });
});

app.get('/users', getusers)

app.post('/logout', Logout);

const resetTokens = {};

// Helper function to generate a secure token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// POST route to send password recovery email
app.post('/forget', (req, res) => {
  const { email } = req.body;

  con.query('SELECT * FROM utilisateurs WHERE email = ?', email, (err, result) => {
    if (result.length > 0) {
      const token = generateToken();
      const tokenExpires = Date.now() + 3600000; // Token expires in 1 hour

      // Store token and expiration in memory
      resetTokens[email] = { token, tokenExpires };
      const resetUrl = `http://localhost:3000/reset-password/${token}`; // Frontend URL for resetting password
      const msg = {
        to: email,
        from: 'adamadieng289@gmail.com',
        subject: 'Réinitialisation de votre mot de passe QQV INVEST',
        text: `Cher(e) client(e),\n\nNous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte QQV INVEST.\n\nCliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetUrl}\n\nSi vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message ou nous contacter immédiatement à l'adresse suivante : yann@formations-moneyimpact.com.\n\nCordialement,\nL’équipe QQV INVEST`,
        html: `
          <p>Cher(e) client(e),</p>
          <p>Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte QQV INVEST.</p>
          <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe : <a href="${resetUrl}">Réinitialiser mon mot de passe</a></p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message ou nous contacter immédiatement à l'adresse suivante : <a href="mailto:yann@formations-moneyimpact.com">yann@formations-moneyimpact.com</a>.</p>
          <p>Cordialement,</p>
          <p>L’équipe QQV INVEST</p>
        `,
      };
      

      sgMail.send(msg)
        .then(() => res.send({ message: 'Recovery email sent' }))
        .catch(error => {
          console.error('Error sending email:', error);
          res.status(500).send({ error: 'Failed to send email' });
        });
    } else {
      res.status(404).send({ error: 'Email not found' });
    }
  });
});

// POST route to reset the password

app.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Find email associated with token
  const email = Object.keys(resetTokens).find(email => resetTokens[email].token === token && resetTokens[email].tokenExpires > Date.now());
  if (email) {
    bcrypt.hash(newPassword, 10, (err, hash) => {
      con.query('UPDATE utilisateurs SET password = ? WHERE email = ?', [hash, email], (error, result) => {
          if (error) {
             res.send({ success: false });
          }else{
            res.send({ success: true });
          }
          });
        });
  } else {
    res.status(400).send({ error: 'Invalid or expired token' });
  }
});

app.listen(4000);
