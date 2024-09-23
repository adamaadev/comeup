import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Recovery() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  const [infos, setInfos] = useState({ password: '', newpassword: '' });
  const [error, setError] = useState('');

  const change = (e) => {
    setInfos({ ...infos, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    if (infos.password !== infos.newpassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    axios.post('http://localhost:4000/changepassword', { email, password1 : infos.password })
    .then(res => {
      console.log(res);
    });
    setError(''); // Réinitialiser l'erreur si les mots de passe correspondent
  };

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Réinitialisation du mot de passe pour {email}</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Nouveau mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={infos.password}
            onChange={change}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newpassword" className="form-label">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="newpassword"
            name="newpassword"
            value={infos.newpassword}
            onChange={change}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Soumettre</button>
      </form>
    </div>
  );
}
