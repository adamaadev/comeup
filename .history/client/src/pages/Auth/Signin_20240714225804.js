import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
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
      } else {
        if (res.data.status === 'false') {
          navigate('/abonnement')
        }
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
        })
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#edf2fc' }}>
      <div className="container mt-4">
        {error && <p className="alert alert-danger">{error}</p>}
        <form onSubmit={submit} className="p-4 shadow-sm bg-white rounded">
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Email" name="email" autoComplete="off" onChange={change} />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Mot de passe" name="password" autoComplete="off" onChange={change} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Se connecter</button>
          <br />
          <Link to={'/signup'} className="mt-2 d-block text-center">ou S'inscrire</Link>
          <Link to={'/forget'} className="d-block text-center">Mot de passe oublié ?</Link>
        </form>
      </div>
    </div>
  );
}
