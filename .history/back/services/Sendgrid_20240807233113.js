function Email async (req, res) => {
    const email = req.body.email;
    const code = generateOTP();
    const msg = {
      to: email,
      from: 'adamadieng289@gmail.com', 
      subject: 'Votre code OTP',
      text: `Cher utilisateur,\n\nVoici votre code OTP : ${code}\n\nCordialement,\nL'équipe administrative`,
      html: `<p style="font-family: Arial, sans-serif; color: #333; font-size: 16px;">Cher utilisateur,<br><br>Voici votre code OTP : <span style="font-weight: bold; font-size: 24px; color: green;">${code}</span><br><br>Cordialement,<br>L'équipe administrative</p>`,
    };
  
    try {
      await sgMail.send(msg);
      res.status(200).send({ message: 'Email sent successfully', otp: code });
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('Error response body:', error.response.body);
      }
      res.status(500).send({ error: 'Failed to send email' });
    }
  }