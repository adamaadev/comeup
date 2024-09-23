import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

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

  // Use useEffect to set the background color of the body
  useEffect(() => {
    document.body.style.backgroundColor = '#edf2fc';

    // Cleanup the style when the component is unmounted
    return () => {
      document.body.style.backgroundColor = null;
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 20, p: 3, borderRadius: 2 }}>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          IQ Invest
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Trouvez les meilleures actions et battez le S&P 500 !
        </Typography>
      </Box>
      <form onSubmit={submit}>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ ml:9, width: '100%' }}>
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
