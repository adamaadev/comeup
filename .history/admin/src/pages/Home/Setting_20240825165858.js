import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Alert, Card, CardContent, CardActions } from '@mui/material';

export default function Setting() {
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState({ username: '', email: '' });
  const [infos, setInfos] = useState({ password1: '', password2: '', password3: '' });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const type = "admin";
  
  function change(e) {
    setError('');
    setInfos({ ...infos, [e.target.name]: e.target.value });
  }

  function send(e) {
    e.preventDefault();
    if (infos.password2 !== infos.password3) {
      setError('Les mots de passe ne correspondent pas !');
    } else if (!infos.password1 || !infos.password2 || !infos.password3) {
      setError('Remplissez tout le formulaire !');
    } else if (infos.password1 === infos.password2) {
      setError('Saisissez un mot de passe différent de l\'ancien');
    } else {
      axios.post('http://localhost:4000/checkpassword',{email, password1: infos.password1})
          .then(res =>{
            if (res.data.exist === false) {
              setError('L\'ancien mot de passe est incorrect !');
            } else {
              axios.post('http://localhost:4000/changepassword', { email, password2: infos.password2 })
              .then(res => {
                if (res.data.success) {
                  alert('Mot de passe changé avec succès !');
                  axios.post('http://localhost:4000/logout',{ type })
                  .then(res => {
                    if (res.data.success) {
                      window.location.reload(true);
                    }
                  });
                } 
              })
            }
          })
    }
  }
  
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setInfo({ username: res.data.username, email: res.data.email });
        setEmail(res.data.email);
      })
  }, []);

  const handleChangePasswordClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <Card>
        <CardContent>
          <Typography variant="h5">Paramètres</Typography>
          <Typography variant="body1">Nom d'utilisateur : {info.username}</Typography>
          <Typography variant="body1">Email : {info.email}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={handleChangePasswordClick}>Changer le mot de passe</Button>
        </CardActions>
      </Card>

      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent>
          <form onSubmit={send}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              margin="normal"
              fullWidth
              label="Mot de passe actuel"
              type="password"
              name="password1"
              onChange={change}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Nouveau mot de passe"
              type="password"
              name="password2"
              onChange={change}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Confirmer le nouveau mot de passe"
              type="password"
              name="password3"
              onChange={change}
            />
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">Enregistrer</Button>
              <Button onClick={handleCloseModal} variant="outlined" color="secondary">Fermer</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
