import React, { useState } from "react";
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
        })
    }
  };

  return (
    <div className="container mt-4">
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Email" name="email" autoComplete="off" onChange={change} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Mot de passe" name="password" autoComplete="off" onChange={change} />
        </div>
        <button type="submit" className="btn btn-success w-100 mb-3">Se connecter</button>
        <Link to={'/signup'} className="btn btn-link d-block">S'inscrire</Link>
        <Link to={'/forget'} className="btn btn-link d-block">Mot de passe oublié ?</Link>
      </form>
    </div>
  );
}
