import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '', type: "admin" });
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
            // Handle error
          }
        })
    }
  };

  // Define the styles as a JavaScript object
  const styles = {
    bodyHtml: {
      backgroundColor: '#edf2fc',
      margin: 0,
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    container: {
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
    headerImg: {
      maxWidth: '150px'
    },
    formTitle: {
      margin: 0,
      fontSize: '24px'
    },
    formParagraph: {
      margin: 0,
      color: '#666',
      marginBottom: '10px'
    },
    mb3: {
      textAlign: 'left',
      width: '100%'
    },
    form: {
      width: '100%'
    },
    btn: {
      padding: '10px 0',
      borderRadius: '5px',
      fontSize: '16px',
      marginTop: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      cursor: 'pointer'
    },
    w100: {
      width: '100%'
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

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Connexion admin</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={submit} style={styles.form}>
          <div style={styles.mb3}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Email" 
              name="email" 
              autoComplete="off" 
              onChange={change} 
            />
          </div>
          <div style={styles.mb3}>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Mot de passe" 
              name="password" 
              autoComplete="off" 
              onChange={change} 
            />
          </div>
          <button type="submit" style={styles.btn}>Se connecter</button>
          <br />
          <Link to={'/register'} style={{ ...styles.btn, textDecoration: 'none' }}>ou S'inscrire</Link>
          <br />
          <Link to={'/forget'} style={{ ...styles.btn, textDecoration: 'none' }}>Mot de passe oublié ?</Link>
        </form>
      </div>
    </div>
  );
}
