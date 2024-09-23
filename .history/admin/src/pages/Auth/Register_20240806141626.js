import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [values, setValues] = useState({ username: '', email: '', password: '', confirmpassword: '' });
  const navigate = useNavigate();
  const type = 'admin';
  const [error, setError] = useState('');
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  
  const change = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    if (!values.username || !values.email || !values.password || !values.confirmpassword) {
      setError("Tous les champs doivent être remplis !");
      return false;
    }
    if (!regex.test(values.email)) {
      setError("Cet email n'est pas valide !");
      return false;
    }
    if (values.password !== values.confirmpassword) {
      setError("Les mots de passe ne correspondent pas !");
      return false;
    }
    return true;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      axios.post('http://localhost:4000/signup', { values , type })
        .then(res => {
          setError(res.data.message);
          if (res.data.success) {
            navigate('/login');
          }
        })
        .catch(err => {
          setError("Erreur lors de l'inscription !");
        });
    }
  };

  return (
    <div className="container mt-4">
    {type}
      <h2 className="mb-4">Admin</h2>
      <form onSubmit={submit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Nom d'utilisateur" 
            name="username" 
            autoComplete="off" 
            onChange={change} 
          />
        </div>
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Email" 
            name="email" 
            autoComplete="off" 
            onChange={change} 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            placeholder="Mot de passe" 
            name="password" 
            autoComplete="off" 
            onChange={change} 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            placeholder="Confirmer le mot de passe" 
            name="confirmpassword" 
            autoComplete="off" 
            onChange={change} 
          />
        </div>
        <button type="submit" className="btn btn-primary">S'inscrire</button>
        <br />
        <Link to={'/login'} className="btn btn-link"> ou Se connecter</Link>
      </form>
    </div>
  );
}
