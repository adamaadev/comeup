import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.jpg';

const styles = {
  body: {
    backgroundColor: '#edf2fc',
    margin: 0,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bodyBackground: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '20px',
    boxSizing: 'border-box'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  header: {
    marginBottom: '20px'
  },
  logo: {
    maxWidth: '150px'
  },
  h2: {
    margin: 0,
    fontSize: '24px'
  },
  p: {
    margin: 0,
    color: '#666',
    marginBottom: '10px'
  },
  mb3: {
    textAlign: 'left',
    width: '100%'
  },
  btn: {
    padding: '10px 0',
    borderRadius: '5px',
    fontSize: '16px',
    marginTop: '10px',
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  alert: {
    color: 'red'
  },
  links: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    width: '100%'
  },
  footer: {
    marginTop: '20px',
    color: '#999',
    fontSize: '14px'
  }
};

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

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.status === 'true') {
          navigate('/')
        } else if (res.data.status === 'false') {
          navigate('/abonnement')
        }
      });
  }, [navigate]);

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
    <div style={styles.body}>
      <div style={styles.bodyBackground}>
        <div style={styles.formContainer}>
          <div style={styles.header}>
            <img src={logo} alt="Logo" style={styles.logo} />
            <h2 style={styles.h2}>QQV INVEST</h2>
            <p style={styles.p}>Dénichez les Meilleures Actions et Surpasser le S&P500 avec l’Approche QQV</p>
          </div>
          {error && <p style={styles.alert}>{error}</p>}
          <form onSubmit={submit}>
            <div style={styles.mb3}>
              <label htmlFor="email">Adresse email</label>
              <input type="text" className="form-control" placeholder="Email" name="email" autoComplete="off" onChange={change} />
            </div>
            <div style={styles.mb3}>
              <label htmlFor="password">Mot de passe</label>
              <input type="password" className="form-control" placeholder="Mot de passe" name="password" autoComplete="off" onChange={change} />
            </div>
            <div style={styles.links}>
              <Link to={'/signup'}>S'inscrire</Link>
              <Link to={'/forget'}>Mot de passe oublié ?</Link>
            </div>
            <button type="submit" style={styles.btn}>Connexion</button>
          </form>
        </div>
      </div>
    </div>
  );
}
