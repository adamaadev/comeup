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
          }
        })
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 bg-light shadow rounded">
        <h2 className="mb-4 text-center">IQ Invest</h2>
        <p className="text-center">Trouvez les meilleures actions et battez le S&P 500 !</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Adresse email *" 
              name="email" 
              autoComplete="off" 
              value={values.email} 
              onChange={change} 
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Mot de passe *" 
              name="password" 
              autoComplete="off" 
              value={values.password} 
              onChange={change} 
            />
          </div>
          <div className="form-check mb-3">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="rememberMe" 
              name="rememberMe" 
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Se souvenir de moi
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">Connexion</button>
          <br />
          <Link to={'/register'} className="btn btn-link d-block text-center mt-2">ou S'inscrire</Link>
          <br />
          <Link to={'/forget'} className="btn btn-link d-block text-center">Mot de passe oublié ?</Link>
        </form>
      </div>
    </div>
  );
}
