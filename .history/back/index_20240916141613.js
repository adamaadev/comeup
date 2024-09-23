import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { Signin , SignUp , CheckUser, ChangePassword, Logout, CheckPassword } from "./services/Auth.js";
import { AddCompany, checkcompany, deletecompany, ListCompanies, Watchlist, WatchlistUser } from "./services/Watchlist.js";
import {ListCompany, screener, search } from "./services/Screener.js";
import { Listanalyse, sendforce, sendrisque , deleteanalyse} from "./services/Analyse.js";
import { checkscore, getExistingQuestions, resetQuestions, sendquestion, updateQuestion } from "./services/Question.js";
import { Email, getusers } from "./services/Sendgrid.js";
import con from "./services/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import axios from "axios";
import Stripe from "stripe";

dotenv.config();
const app = express();
app.use(
    express.json({
        verify: function (req, res, buf) {
            req.rawBody = buf;  // Enregistrer le corps brut pour Stripe
        }
    })
);
app.use(cookieParser());
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));

app.post("/", CheckUser, (req, res) => {
    res.send({ success: true, id : req.id , username: req.username, email: req.email , status : req.status , essaie : req.essaie , status : req.status , type : req.type, carte : req.carte, date_debut : req.date_debut, date_fin : req.date_fin, plan : req.plan});
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

app.post('/watchlist/user',WatchlistUser)
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

function getNotation(value) {
  const score = parseFloat(value);
  if (isNaN(score)) return 'N/A'; // For non-numeric values

  if (score < 7) {
    return 'Faible';
  } else if (score >= 7 && score <= 10) {
    return 'Correct';
  } else {
    return 'Excellente';
  }
}

app.get('/api/ratios', (req, res) => {
  const query = `
    SELECT
      croissance_annualisee, croissance_moyenne, debt_equity, ratio_payout, performance,
      buyback_yield, croissance_CA_1_an, croissance_CA_5_ans, croissance_CA_10_ans, 
      fcf_1_year, fcf_5_years, fcf_10_years, fcf_margin_one_year, fcf_margin_five_year, 
      roce, roce_5_year_avg, croissance_resultat_net_1_an, croissance_resultat_net_5_ans, 
      piotroski_score, ratio_capex_revenu_net, rachat_net_moyen, nbreannee, quanti
    FROM screener LIMIT 1000;
  `;

  con.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    // Restructure the response to have the desired format
    const ratios = results.map(result => ({
      croissance_annualisee: { value: result.croissance_annualisee, notation: getNotation(result.croissance_annualisee) },
      croissance_moyenne: { value: result.croissance_moyenne, notation: getNotation(result.croissance_moyenne) },
      debt_equity: { value: result.debt_equity, notation: getNotation(result.debt_equity) },
      ratio_payout: { value: result.ratio_payout, notation: getNotation(result.ratio_payout) },
      performance: { value: result.performance, notation: getNotation(result.performance) },
      buyback_yield: { value: result.buyback_yield, notation: getNotation(result.buyback_yield) },
      croissance_CA_1_an: { value: result.croissance_CA_1_an, notation: getNotation(result.croissance_CA_1_an) },
      croissance_CA_5_ans: { value: result.croissance_CA_5_ans, notation: getNotation(result.croissance_CA_5_ans) },
      croissance_CA_10_ans: { value: result.croissance_CA_10_ans, notation: getNotation(result.croissance_CA_10_ans) },
      fcf_1_year: { value: result.fcf_1_year, notation: getNotation(result.fcf_1_year) },
      fcf_5_years: { value: result.fcf_5_years, notation: getNotation(result.fcf_5_years) },
      fcf_10_years: { value: result.fcf_10_years, notation: getNotation(result.fcf_10_years) },
      fcf_margin_one_year: { value: result.fcf_margin_one_year, notation: getNotation(result.fcf_margin_one_year) },
      fcf_margin_five_year: { value: result.fcf_margin_five_year, notation: getNotation(result.fcf_margin_five_year) },
      roce: { value: result.roce, notation: getNotation(result.roce) },
      roce_5_year_avg: { value: result.roce_5_year_avg, notation: getNotation(result.roce_5_year_avg) },
      croissance_resultat_net_1_an: { value: result.croissance_resultat_net_1_an, notation: getNotation(result.croissance_resultat_net_1_an) },
      croissance_resultat_net_5_ans: { value: result.croissance_resultat_net_5_ans, notation: getNotation(result.croissance_resultat_net_5_ans) },
      piotroski_score: { value: result.piotroski_score, notation: getNotation(result.piotroski_score) },
      ratio_capex_revenu_net: { value: result.ratio_capex_revenu_net, notation: getNotation(result.ratio_capex_revenu_net) },
      rachat_net_moyen: { value: result.rachat_net_moyen, notation: getNotation(result.rachat_net_moyen) },
      nbreannee: { value: result.nbreannee, notation: getNotation(result.nbreannee) },
      quanti: { value: result.quanti, notation: getNotation(result.quanti) }
    }));

    res.send(ratios);
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

app.post('/submitscore', (req, res) => {
  con.query('SELECT * FROM scores WHERE id_user = ? AND symbol = ?', [req.body.id, req.body.symbol], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      con.query('UPDATE scores SET score = ? WHERE id_user = ? AND symbol = ?', [req.body.score, req.body.id, req.body.symbol], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send('Score mis à jour');
      });
    } else {
      con.query('INSERT INTO scores (id_user, symbol, score) VALUES (?, ?, ?)', [req.body.id, req.body.symbol, req.body.score], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send('Score ajouté');
      });
    }
  });
});


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

app.use(bodyParser.json()); // Middleware pour traiter les requêtes JSON

const stripe = Stripe('sk_test_51JqmbXFTPbYwB9q1gf1NtF6zIluUkZhpm20xl2ANeyg1oJiq5KFaJfKBo1h0IyUrJRPSiBOyilY3phemyW67Wmro00kh7r9yoX');

app.post('/checkauth',(req,res)=>{
  con.query('SELECT * FROM utilisateurs WHERE id = ?',[req.body.id],(err,result)=>{
    res.send(result)
  })
});

app.get('/subscribe', async (req, res) => {
  const plan = req.query.plan;
  const email = req.query.email; // email de l'utilisateur

  if (!plan || !email) {
      return res.status(400).json({ error: 'Missing plan or email' });
  }

  let priceId;
  switch (plan.toLowerCase()) {
      case 'free':
          priceId = 'price_1Pyk7JFTPbYwB9q1UCGceLhD';
          break;
      case 'starter':
          priceId = 'price_1PqNAaFTPbYwB9q1b2pA90nF';
          break;
      case 'pro':
          priceId = 'price_1PqhMcFTPbYwB9q16TEha35N';
          break;
      default:
          return res.status(400).json({ error: 'Subscription plan not found' });
  }

  try {
      const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          customer_email: email, // Email en lecture seule
          line_items: [
              {
                  price: priceId,
                  quantity: 1,
              },
          ],
          success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.BASE_URL}/cancel`,
      });

      res.json({ url: session.url });
  } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route pour le succès de l'abonnement
app.get('/success', (req, res) => {
    res.send('Subscribed successfully');
});

// Route pour annuler l'abonnement
app.get('/cancel', (req, res) => {
    res.redirect('/');
});

// Route pour créer une session de portail client
app.get('/customers/:customerId', async (req, res) => {
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: req.params.customerId,
            return_url: `${process.env.BASE_URL}/`,
        });

        res.redirect(portalSession.url);
    } catch (error) {
        console.error('Error creating billing portal session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route du webhook Stripe
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_ebb9f10c1497412cc0c1777ea70f40937ad7230672abdd49f8db96828557c8c2';

  let event;

  try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Mettez à jour la table utilisateurs avec les données de la session
      const customerId = session.customer; // ID Stripe du client
      const paymentMethod = session.payment_method; // Méthode de paiement
      const productId = session.subscription; // ID du produit/abonnement

      // Mettre à jour la base de données
      con.query(
          'UPDATE utilisateurs SET essaie = "true", carte = ?, date_debut = NOW(), date_fin = DATE_ADD(NOW(), INTERVAL 7 DAY), produit_id = ? WHERE email = ?',
          [paymentMethod, productId, session.customer_email],
          (err, result) => {
              if (err) {
                  console.error('Error updating user:', err);
                  return res.status(500).json({ error: 'Database error' });
              }
              console.log('User updated successfully');
              res.json({ received: true });
          }
      );
  } else {
      res.json({ received: true });
  }
});



app.listen(4000, () => {
  console.log('Server running on port 4000');
});