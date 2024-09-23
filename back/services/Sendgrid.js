import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import con from './db.js';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Fonction pour envoyer un email
export async function Email(req, res) {
  const emails = req.body.to; // On reçoit un tableau d'emails
  const messageContent = req.body.message; // Le message à envoyer

  try {
    const emailPromises = emails.map(async (email) => {
      const msg = {
        to: email,
        from: 'adamadieng289@gmail.com',
        subject: 'Message de l\'équipe administrative',
        text: `Cher utilisateur,\n\n${messageContent}\n\nCordialement,\nL'équipe administrative`,
        html: `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">Cher utilisateur,<br><br>${messageContent}<br><br>Cordialement,<br>L'équipe administrative</p>`,
      };
      
      await sgMail.send(msg);
    });

    await Promise.all(emailPromises); // Envoyer tous les emails
    res.send({ success: true, message: 'Emails envoyés avec succès' });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    res.status(500).send({ error: 'Failed to send email' });
  }
}

// Fonction pour récupérer les emails des utilisateurs
export function getusers(req, res) {
  con.query("SELECT email FROM utilisateurs WHERE type = 'user'", (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to retrieve users' });
    }
    if (result.length > 0) {
      const emails = result.map(row => row.email); // On extrait les emails des résultats
      res.send(emails);
    } else {
      res.send([]);
    }
  });
}
