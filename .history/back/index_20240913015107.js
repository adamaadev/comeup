import express from "express";
import cors from "cors";
import bodyparser from 'body-parser';
import cookieParser from "cookie-parser";
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { Signin , SignUp , CheckUser, ChangePassword, Logout, CheckPassword } from "./services/Auth.js";
import { AddCompany, checkcompany, deletecompany, ListCompanies, Watchlist } from "./services/Watchlist.js";
import {ListCompany, screener, search } from "./services/Screener.js";
import { Listanalyse, sendforce, sendrisque , deleteanalyse} from "./services/Analyse.js";
import { checkscore, getExistingQuestions, resetQuestions, sendquestion, updateQuestion } from "./services/Question.js";
import { Email, getusers } from "./services/Sendgrid.js";
import con from "./services/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import axios from "axios";
import Stripe from "stripe";
const stripe = Stripe('sk_test_51JqmbXFTPbYwB9q1gf1NtF6zIluUkZhpm20xl2ANeyg1oJiq5KFaJfKBo1h0IyUrJRPSiBOyilY3phemyW67Wmro00kh7r9yoX');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.json());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));

app.post("/", CheckUser, (req, res) => {
  con.query('SELECT * FROM utilisateurs WHERE id = ?',[req.id],(err,result)=>{
    res.send({ success: true, id : req.id , username: req.username, email: req.email , status : req.status , essaie : req.essaie , status : req.status });
  })
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

// Route to add a new record
app.post('/douve/add', (req, res) => {
  const { symbol, reponse, justification, id_user } = req.body;

  const query = `INSERT INTO douve (symbol, reponse, justification, id_user) VALUES (?, ?, ?, ?)`;

  con.query(query, [symbol, reponse, justification, id_user], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding douve');
    }
    // Fetch the newly added douve and return it in the response
    const newDouveId = result.insertId;
    const selectQuery = `SELECT * FROM douve WHERE id = ?`;

    con.query(selectQuery, [newDouveId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching new douve');
      }
      res.json(rows[0]);
    });
  });
});

// Route to list all records
app.post('/douve/list', (req, res) => {
  const query = `SELECT * FROM douve WHERE symbol = ? AND id_user = ?`;

  con.query(query, [req.body.symbol, req.body.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching douves');
    }
    res.json(results);
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
    res.status(204).send(); // No content to send back
  });
});
// Route to add a new record
app.post('/scenario/add', (req, res) => {
  const { symbol, reponse, justification, id_user } = req.body;

  const query = `INSERT INTO scenario (symbol, reponse, justification, id_user) VALUES (?, ?, ?, ?)`;

  con.query(query, [symbol, reponse, justification, id_user], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding scenario');
    }
    // Fetch the newly added scenario and return it in the response
    const newScenarioId = result.insertId;
    const selectQuery = `SELECT * FROM scenario WHERE id = ?`;

    con.query(selectQuery, [newScenarioId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching newly added scenario');
      }
      res.send(rows[0]);  // Return the newly added scenario
    });
  });
});

// Route to list all records
app.post('/scenario/list', (req, res) => {
  const query = `SELECT * FROM scenario WHERE symbol = ? AND id_user = ?`;

  con.query(query, [req.body.symbol, req.body.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching scenarios');
    }
    res.send(results);
  });
});

// Route to delete a record by ID
app.delete('/scenario/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM scenario WHERE id = ?`;

  con.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error deleting scenario');
    }
    res.send({ message: 'Scenario deleted successfully' });
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
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message </p>
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

function getPercentile(values, percentile) {
  if (values.length === 0) return 'No valid values';
  values = values.filter(value => value !== 0);
  const len = values.length;
  if (len === 0) return 'Not enough data';
  values.sort((a, b) => a - b);
  const index = Math.floor((percentile / 100) * len);
  return values[index].toFixed(2);
}

function getMedian(values) {
  if (values.length === 0) return 'No valid values';
  values = values.filter(value => value !== 0);
  const len = values.length;
  if (len === 0) return 'Not enough data';
  values.sort((a, b) => a - b);
  const mid = Math.floor(len / 2);
  if (len % 2 === 0) {
    return ((values[mid - 1] + values[mid]) / 2).toFixed(2);
  }
  return values[mid].toFixed(2);
}

// Nouvelle fonction pour attribuer des scores
function assignScore(value) {
  if (value >= 15) return 'Excellent';
  if (value >= 10 && value < 15) return 'Correct';
  return 'Faible';
}

app.get('/api/ratios', (req, res) => {
  const query = `
    SELECT
      croissance_annualisee, croissance_moyenne, debt_equity, ratio_payout, performance,
      buyback_yield, croissance_CA_1_an, croissance_CA_5_ans, croissance_CA_10_ans, 
      fcf_1_year, fcf_5_years, fcf_10_years, fcf_margin_one_year, fcf_margin_five_year, 
      roce, roce_5_year_avg, croissance_resultat_net_1_an, croissance_resultat_net_5_ans, 
      piotroski_score, ratio_capex_revenu_net, rachat_net_moyen, nbreannee
    FROM screener;
  `;

  con.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    const ratios = [
      "croissance_annualisee", "croissance_moyenne", "debt_equity", "ratio_payout", "performance",
      "buyback_yield", "croissance_CA_1_an", "croissance_CA_5_ans", "croissance_CA_10_ans", 
      "fcf_1_year", "fcf_5_years", "fcf_10_years", "fcf_margin_one_year", "fcf_margin_five_year", 
      "roce", "roce_5_year_avg", "croissance_resultat_net_1_an", "croissance_resultat_net_5_ans", 
      "piotroski_score", "ratio_capex_revenu_net", "rachat_net_moyen", "nbreannee"
    ];

    const ratioValues = {};

    ratios.forEach(ratio => {
      ratioValues[ratio] = [];
    });

    results.forEach(row => {
      ratios.forEach(ratio => {
        let value = row[ratio];
        if (value !== null && value !== undefined) {
          value = parseFloat(value);
          if (!isNaN(value)) {
            ratioValues[ratio].push(value);
          }
        }
      });
    });

    const percentiles = {};

    ratios.forEach(ratio => {
      const percentile25 = getPercentile(ratioValues[ratio], 25);
      const percentile75 = getPercentile(ratioValues[ratio], 75);
      const median = getMedian(ratioValues[ratio]);
      const score = assignScore(median); // Utilisez la nouvelle fonction assignScore

      percentiles[ratio] = {
        percentile25,
        percentile75,
        median,
        score, // Ajoutez le score attribué ici
        ranges: {
          Excellent: `${percentile75}+`,
          Correct: `${percentile25} - ${percentile75}`,
          Faible: `${percentile25}-`
        }
      };
    });

    res.json(percentiles);
    console.log(percentiles);
  });
});

app.post('/screener/ratios',(req,res)=>{
  con.query('SELECT * FROM screener WHERE symbol = ?',[req.body.symbol],(err,result)=>{
    res.send(result);
  })
});

app.post('/getlogo',(req,res)=>{
  con.query('SELECT logo FROM screener WHERE symbol = ?',[req.body.symbol],(err,result)=>{
    res.send(result);
  })
})

function Update() {
  // Vérifiez d'abord si la table 'info' est vide
  con.query("SELECT COUNT(*) AS count FROM info", (err, result) => {
    if (err) throw err;

    // Si la table est vide, insérer les données de 'screener' dans 'info'
    if (result[0].count === 0) {
      con.query("INSERT INTO info (symbol, currency) SELECT symbol, currency FROM screener", (err, insertResult) => {
        if (err) throw err;
        console.log("Données insérées dans 'info' depuis 'screener' car la table 'info' était vide.");
      });
    } 

    // Ensuite, continuez la logique pour les mises à jour
    con.query("SELECT symbol, currency FROM info LIMIT 1", (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        const symbol = result[0].symbol;
        const currency = result[0].currency;

        axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
          .then(res => {
            const capitalisation = res.data[0].mktCap;
            if (currency === 'USD') {
              con.query('UPDATE screener SET Capitalisation = ? WHERE symbol = ?', [capitalisation, symbol], (err, result) => {
                if (result) {
                  con.query('DELETE FROM info WHERE symbol = ?', [symbol], (err, success) => {
                    if (success) {
                      console.log("Mise à jour réussie pour les États-Unis");
                    }
                  });
                }
              });
            } else {
              axios.get(`https://financialmodelingprep.com/api/v3/forex/${currency}USD?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
                .then(res => {
                  const ask = res.data.ask;
                  const converted = Math.round(capitalisation * ask) + 1;
                  con.query('UPDATE screener SET Capitalisation = ? WHERE symbol = ?', [converted, symbol], (err, result) => {
                    if (result) {
                      con.query('DELETE FROM info WHERE symbol = ?', [symbol], (err, success) => {
                        if (success) {
                          console.log("Mise à jour réussie pour les entreprises hors États-Unis");
                        }
                      });
                    }
                  });
                });
            }
          });
      } else {
        console.log("Aucune donnée à mettre à jour.");
      }
    });
  });
}

app.post('/essaie', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Essai gratuit',
          },
          unit_amount: 0,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    // Vous pouvez également ajouter ici la logique pour stocker les informations de l'essai gratuit

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session Stripe.' });
  }
});


app.listen(4000);