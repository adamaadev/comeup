import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

export default function Signup() {
  const [values, setValues] = useState({ username: '', email: '', password: '', confirmpassword: '', type: "admin" });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const regex = /^[^@]+@[^@]+\.[^@]+$/;

  const change = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    if (!values.username || !values.email || !values.password || !values.confirmpassword) {
      setError("Tous les champs doivent être remplis !");
      return false;
    }
    if (!regex.test(values.email)) {
      setError("Cet email n'est pas valide !");
      return false;
    }
    if (values.password !== values.confirmpassword) {
      setError("Les mots de passe ne correspondent pas !");
      return false;
    }
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      axios.post('http://localhost:4000/signup', { values })
        .then(res => {
          setError(res.data.message);
          if (res.data.success) {
            navigate('/login');
          }
        })
        .catch(err => {
          setError("Erreur lors de l'inscription !");
        });
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#edf2fc', 
        p: 2, 
        mt: 10 
      }}
    >
      <Box sx={{ maxWidth: 500, width: '100%' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Inscription
        </Typography>
        <form onSubmit={submit}>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Nom d'utilisateur"
            variant="outlined"
            margin="normal"
            name="username"
            autoComplete="off"
            onChange={change}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
            autoComplete="off"
            onChange={change}
          />
          <TextField
            fullWidth
            label="Mot de passe"
            variant="outlined"
            margin="normal"
            type="password"
            name="password"
            autoComplete="off"
            onChange={change}
          />
          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            variant="outlined"
            margin="normal"
            type="password"
            name="confirmpassword"
            autoComplete="off"
            onChange={change}
          />

          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth 
            sx={{ mt: 2, backgroundColor: '#007bff', textTransform: 'none', fontWeight: 'bold' }}
          >
            S'inscrire
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to={'/login'} style={{ textDecoration: 'none', color: '#007bff' }}>
              ou Se connecter
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
