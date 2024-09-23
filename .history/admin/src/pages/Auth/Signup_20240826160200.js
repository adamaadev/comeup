import React, { useState, useEffect } from "react";
import axios from 'axios';
import logo from '../Assets/logo.png';
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
      axios.post('http://localhost:4000/signup', {values})
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

  useEffect(() => {
    document.body.style.backgroundColor = '#edf2fc';

    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#edf2fc',
        p: 2,
        
      }}
    >
      <Box sx={{ maxWidth: 500, width: '100%' }}>
        <form onSubmit={submit}>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            {/* Image at the top */}
            <img 
              src={logo} 
              alt="Logo" 
              style={{ maxWidth: '180px', maxHeight: '130px', marginBottom: '1px' }} 
            />
            <Typography variant="h4" component="h2" gutterBottom>
              QQV INVEST
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="subtitle1" color="textSecondary">
                Dénichez les Meilleures Actions et Surpasser le S&P500 avec l’Approche QQV.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%' }}>
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
              label="Adresse email"
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
              label="Confirmer le Mot de passe"
              variant="outlined"
              margin="normal"
              type="password"
              name="confirmpassword"
              autoComplete="off"
              onChange={change}
            />

            {/* Flex container for the links */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
             
              <Typography variant="body2" sx={{ flexGrow: 1, textAlign: 'right' }}>
                <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
                  Déjà un compte ? Connectez-vous
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
              S'inscrire
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
