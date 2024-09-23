import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Singin() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [values, setValues] = useState({ email: '', password: '' });

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

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.status === 'true') {
          navigate('/')
        } else if (res.data.status === 'false') {
          navigate('/abonnement')
        }
      });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      axios.post('http://localhost:4000/signin', { values })
        .then(res => {
          if (res.data.success) {
            if (res.data.status === 'false') {
              navigate('/abonnement')
            } else {
              navigate('/');
            }
          } else {
            setError(res.data.message)
          }
        });
    }
  };

  return (
    <div className="body-background">
      <div className="form-container">
        <div className="header">
          <img src="your-logo-url.png" alt="Logo" className="logo" />
          <h2>IQ Invest</h2>
          <p>Trouvez les meilleures actions et battez le S&P 500 !</p>
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
          <button type="submit" className="btn btn-primary w-100">Connexion</button>
          <Link to={'/signup'} className="mt-3 d-block text-center">Vous n'avez pas encore de compte ? Inscription</Link>
          <Link to={'/forget'} className="d-block text-center">Mot de passe oublié ?</Link>
        </form>
        <footer className="footer">
          <p>Copyright © IQ Invest 2024.</p>
        </footer>
      </div>
    </div>
  );
}
