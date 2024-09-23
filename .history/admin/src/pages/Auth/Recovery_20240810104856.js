import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Recovery() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  const [infos, setInfos] = useState({ password1: '', password2: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const change = (e) => {
    setInfos({ ...infos, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (infos.password1 !== infos.password2) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    axios.post('http://localhost:4000/changepassword', { email, password2: infos.password1 })
      .then(res => {
        if (res.data.success) {
          setSuccess('Mot de passe modifié avec succès.');
          setInterval(()=>{
            navigate('/login',{reset : true})
          },[1000])
        } else if (res.data.exist === false) {
          setError('Adresse e-mail non trouvée.');
        } else {
          setError('Une erreur est survenue. Veuillez réessayer.');
        }
      })
      .catch(err => {
        setError('Erreur lors de la communication avec le serveur.');
      });
  };



  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Réinitialisation du mot de passe pour {email}</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="password1" className="form-label">Nouveau mot de passe</label>
          <input
            type="password1"
            className="form-control"
            id="password1"
            name="password1"
            value={infos.password1}
            onChange={change}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password2" className="form-label">Confirmer le nouveau mot de passe</label>
          <input
            type="password1"
            className="form-control"
            id="password2"
            name="password2"
            value={infos.password2}
            onChange={change}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button type="submit" className="btn btn-primary">Soumettre</button>
      </form>
    </div>
  );
}
