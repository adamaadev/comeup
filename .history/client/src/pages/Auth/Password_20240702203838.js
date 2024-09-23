import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

export default function Password() {
  const [infos, setInfos] = useState({ password1: '', password2: '', password3: '' });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        setEmail(res.data.email);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération de l\'email : ', err);
      });
  }, []);

  function change(e) {
    setError('');
    setInfos({ ...infos, [e.target.name]: e.target.value });
  }

  function send(e) {
    e.preventDefault();
    if (infos.password2 !== infos.password3) {
      setError('Les mots de passe ne correspondent pas !');
    } else if (!infos.password1 || !infos.password2 || !infos.password3) {
      setError('Remplissez tous les champs !');
    } else if (infos.password1 === infos.password2) {
      setError('Saisissez un mot de passe différent de l\'ancien');
    } else {
      axios.post('http://localhost:4000/changepassword', { email, infos })
        .then(res => {
          console.log(res);
          if (!res.data.exist) {
            setError('L\'ancien mot de passe est incorrect !');
          } else {
            alert('Mot de passe changé avec succès !');
          }
        })
        .catch(err => {
          console.error('Erreur lors du changement de mot de passe : ', err);
          setError('Une erreur s\'est produite. Veuillez réessayer.');
        });
    }
  }

  return (
    <div className="container mt-4">
      <form onSubmit={send}>
        <div className="mb-3">
          <input type="password" className="form-control" name="password1" placeholder="Ancien mot de passe" onChange={change} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" name="password2" placeholder="Nouveau mot de passe" onChange={change} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" name="password3" placeholder="Confirmer le nouveau mot de passe" onChange={change} />
        </div>
        <button type="submit" className="btn btn-primary">Sauvegarder</button>
      </form>
      <Outlet />
    </div>
  );
}
