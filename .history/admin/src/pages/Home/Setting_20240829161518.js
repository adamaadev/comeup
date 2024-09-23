import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Setting() {
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState({ username: '', email: '' });
  const [infos, setInfos] = useState({ password1: '', password2: '', password3: '' });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const type = "admin";
  
  function change(e) {
    setError('');
    setInfos({ ...infos, [e.target.name]: e.target.value });
  }

  function send(e) {
    e.preventDefault();
    if (infos.password2 !== infos.password3) {
      setError('Les mots de passe ne correspondent pas !');
    } else if (!infos.password1 || !infos.password2 || !infos.password3) {
      setError('Remplissez tout le formulaire !');
    } else if (infos.password1 === infos.password2) {
      setError('Saisissez un mot de passe différent de l\'ancien');
    } else {
      axios.post('http://localhost:4000/checkpassword',{email, password1: infos.password1})
          .then(res =>{
            if (res.data.exist === false) {
              setError('L\'ancien mot de passe est incorrect !');
            } else {
              axios.post('http://localhost:4000/changepassword', { email, password2: infos.password2 })
              .then(res => {
                if (res.data.success) {
                  alert('Mot de passe changé avec succès !');
                  axios.post('http://localhost:4000/logout',{ type })
                  .then(res => {
                    if (res.data.success) {
                      window.location.reload(true);
                    }
                  });
                } 
              })
            }
          })
    }
  }
  
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => {
        setInfo({ username: res.data.username, email: res.data.email });
        setEmail(res.data.email);
      })
  }, []);

  const handleChangePasswordClick = () => {
    setShowModal(true);
    document.body.classList.add('modal-open');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div style={modalStyle}>
        <div style={modalDialogStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h5>Changer le mot de passe</h5>
              <button onClick={handleCloseModal}>&times;</button>
            </div>
            <div style={modalBodyStyle}>
              <form onSubmit={send}>
                {error && <div style={errorStyle}>{error}</div>}
                <div style={formGroupStyle}>
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <input type="password" name="password1" onChange={change} style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <input type="password" name="password2" onChange={change} style={inputStyle} />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                  <input type="password" name="password3" onChange={change} style={inputStyle} />
                </div>
                <div style={modalFooterStyle}>
                  <button type="submit" style={buttonPrimaryStyle}>Enregistrer</button>
                  <button type="button" onClick={handleCloseModal} style={buttonSecondaryStyle}>Fermer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={cardBodyStyle}>
          <h3>Paramètres</h3>
          <p>Nom d'utilisateur : {info.username}</p>
          <p>Email : {info.email}</p>
          <button style={buttonPrimaryStyle} onClick={handleChangePasswordClick}>Changer le mot de passe</button>
        </div>
      </div>
      {renderModal()}
    </div>
 
