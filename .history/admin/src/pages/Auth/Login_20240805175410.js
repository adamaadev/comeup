import React, { useState , useEffect} from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
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
  useEffect(() => {
    axios.get('http://localhost:4000/checkadmin')
      .then(res => {
        if (res.data.success) {
          navigate('/');
        } 
      });
  }, []);

  axios.defaults.withCredentials = true;
  const submit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      axios.post('http://localhost:4000/login', { values })
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
    <div className="container mt-4">
      <h2 className="mb-4">Connexion admin</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
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
        <button type="submit" className="btn btn-primary">Se connecter</button>
        <br />
        <Link to={'/register'} className="btn btn-link"> ou S'inscrire</Link>
        <br />
        <Link to={'/forget'} className="btn btn-link">Mot de passe oublié ?</Link>
      </form>
    </div>
  );
}
