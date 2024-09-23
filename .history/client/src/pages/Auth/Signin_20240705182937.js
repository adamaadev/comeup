import React, { useState , useEffect } from "react";
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

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:4000/').then(res => {
      if (res.data.status === 'true') {
        navigate('/')
    }else{
      if (res.data.status === 'false') {
        navigate('/abonnement')
    }
    }
    });
  }, []);

  axios.defaults.withCredentials = true;
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
          }else{
            setError(res.data.message)
          }
        })  
    }
  };

  return (
    <div className="container mt-4">
      <h2>Connexion user</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Email" name="email" autoComplete="off" onChange={change} />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Mot de passe" name="password" autoComplete="off" onChange={change} />
        </div>
        <button type="submit" className="btn btn-primary">Se connecter</button>
        <br />
        <Link to={'/signup'} className="mt-2 d-block">ou S'inscrire</Link>
        <Link to={'/forget'} className="d-block">Mot de passe oublié ?</Link>
      </form>
    </div>
  );
}
