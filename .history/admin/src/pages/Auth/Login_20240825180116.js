import React, { useState, useEffect } from "react";
import axios from 'axios';
import logo from '../Assets/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';  // Importer une icône

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '', type: "admin" });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const change = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    if (!values.email || !values.password) {
      setError("Tous les champs doivent être remplis !");
      return false;
    }
    return true;
  };

  axios.defaults.withCredentials = true;
  const submit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      axios.post('http://localhost:4000/signin', { values })
        .then(res => {
          setError(res.data.message);
          if (res.data.success) {
            navigate('/');
          } 
        });
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = '#edf2fc';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 10, p: 3, borderRadius: 2 }}>
      <form onSubmit={submit}>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        {/* Image at the top */}
        <img 
          src={logo} 
          alt="Logo" 
          style={{ maxWidth: '100px', marginBottom: '16px' }} 
        />
        <Typography variant="h4" component="h2" gutterBottom>
          QQV INVEST
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <InfoOutlined sx={{ mr: 1, color: '#007bff' }} /> {/* Icone avant le texte */}
          <Typography variant="subtitle1" color="textSecondary">
            Dénichez les Meilleures Actions et Surpasser le S&P500 avec l’Approche QQV.
          </Typography>
        </Box>
      </Box>
        <Box sx={{ ml: 9, width: '100%' }}>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <TextField
            fullWidth
            label="Adresse email"
            variant="outlined"
            margin="normal"
            name="email"
            autoComplete="off"
            onChange={change}
            required
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
            required
          />

          {/* Flex container for the links */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" sx={{ flexShrink: 0 }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#007bff' }}>
                Mot de passe oublié ?
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'right' }}>
              <Link to="/signup" style={{ textDecoration: 'none', color: '#007bff' }}>
                S'inscrire
              </Link>
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth 
            sx={{ mt: 2, backgroundColor: '#007bff', textTransform: 'none', fontWeight: 'bold' }}
          >
            Connexion
          </Button>
        </Box>
      </form>
    </Box>
  );
}
