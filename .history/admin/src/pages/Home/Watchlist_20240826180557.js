import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const EmailForm = () => {
  const [emails, setEmails] = useState(['']);
  
  // Fonction pour ajouter un nouveau champ d'email
  const addEmailField = () => {
    setEmails([...emails, '']);
  };
  
  // Fonction pour mettre à jour l'email à un index spécifique
  const handleEmailChange = (index, event) => {
    const newEmails = [...emails];
    newEmails[index] = event.target.value;
    setEmails(newEmails);
  };

  // Calculer la hauteur du formulaire en fonction du nombre d'e-mails
  const formHeight = 50 + emails.length * 60; // Ajuster selon vos besoins
  
  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: 600, 
        margin: '0 auto', 
        padding: 2, 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        boxShadow: 2,
        height: `${formHeight}px` // Ajuste la hauteur
      }}
    >
      {emails.map((email, index) => (
        <TextField
          key={index}
          label={`Email ${index + 1}`}
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(event) => handleEmailChange(index, event)}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={addEmailField}
        sx={{ mt: 2 }}
      >
        Ajouter un autre e-mail
      </Button>
    </Box>
  );
};

export default EmailForm;
