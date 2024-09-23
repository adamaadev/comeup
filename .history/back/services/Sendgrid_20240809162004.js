import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import con from './db.js';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Stockage temporaire des codes OTP (utiliser une solution plus robuste en production)
const otpStore = new Map(); 

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export async function Email(req, res) {
    const email = req.body.email;
    const code = generateOTP();
    otpStore.set(email, code); // Stocker le code pour l'email donné
    console.log(code);

    const msg = {
      to: email,
      from: 'adamadieng289@gmail.com', 
      subject: 'Votre code OTP',
      text: `Cher utilisateur,\n\nVoici votre code OTP : ${code}\n\nCordialement,\nL'équipe administrative`,
      html: `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">Cher utilisateur,<br><br>Voici votre code OTP : <span style="font-weight: bold; font-size: 24px; color: green;">${code}</span><br><br>Cordialement,<br>L'équipe administrative</p>`,
    };

    try {
      await sgMail.send(msg);
      res.status(200).send({ otp: code }); // Envoyer le code OTP au client
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('Error response body:', error.response.body);
      }
      res.status(500).send({ error: 'Failed to send email' });
    }
}

export function verifyOtp(req, res) {
  const { email, code } = req.body;
  if (otpStore.get(email) === code) {
    res.status(200).send({ success: true });
  } else {
    res.status(400).send({ error: 'Invalid OTP' });
  }
}
export function getusers (req , res){
  con.query("SELECT * FROM utilisateurs WHERE type = 'user'",(err,result)=>{
    if (result.length > 0) {
      res.send(result)
    }
  })
}