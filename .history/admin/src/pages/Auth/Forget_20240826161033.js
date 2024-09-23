import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

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

  useEffect(() => {
    document.body.style.backgroundColor = '#edf2fc';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Mot de passe oublié
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Adresse email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Soumettre
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
