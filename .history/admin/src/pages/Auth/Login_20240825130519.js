import React, { useState } from "react";
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

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4, p: 3, boxShadow: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Connexion admin
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={submit}>
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
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Se connecter
        </Button>
        <Box mt={2}>
          <Button component={Link} to="/register" variant="text" fullWidth>
            ou S'inscrire
          </Button>
          <Button component={Link} to="/forget" variant="text" fullWidth>
            Mot de passe oublié ?
          </Button>
        </Box>
      </form>
    </Box>
  );
}
