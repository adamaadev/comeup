import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' , type : "admin" });
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
          setError(res.data.message)
          if (res.data.success) {
            navigate('/');
          } else {
            
          }
        })
    }
  };

  return (
    <div className="body-background">
      <div className="form-container">
        <div className="header">
          <img src={logo} alt="Logo" className="logo" />
          <h2>QQV INVEST</h2>
          <p>Dénichez les Meilleures Actions et Surpasser le S&P500 avec l’Approche QQV</p>
        </div>
        {error && <p className="alert alert-danger">{error}</p>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="email">Adresse email</label>
            <input type="text" className="form-control" placeholder="Email" name="email" autoComplete="off" onChange={change} />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" className="form-control" placeholder="Mot de passe" name="password" autoComplete="off" onChange={change} />
          </div>
          <div className="links">
            <Link to={'/signup'}>S'inscrire</Link>
            <Link to={'/forget'}>Mot de passe oublié ?</Link>
          </div>
          <button type="submit" className="btn btn-primary w-100">Connexion</button>
        </form>
      </div>
    </div>
  );
}
