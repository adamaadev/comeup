import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';

export default function Forget() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/forget', { email })
      .then(res => {
        if (res.data.message) {
          alert('Un lien de récupération a été envoyé vers votre adresse email');
          navigate('/login');
        } else {
          alert('Cet email n\'existe pas');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Une erreur est survenue, veuillez réessayer plus tard');
      });
  };

  return (
    <Container maxWidth="xs">
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <Typography variant="h5">Mot de passe oublié</Typography>
        </Grid>
        <Grid item>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Adresse email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
            >
              Soumettre
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
