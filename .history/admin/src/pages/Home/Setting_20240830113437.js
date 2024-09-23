import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table } from "react-bootstrap";

export default function Setting() {
  const [info, setInfo] = useState({ username: '', email: '' });
  const [infos, setInfos] = useState({ password1: '', password2: '', password3: '' });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const type = "admin";
  const [showModal, setShowModal] = useState(false);
  
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

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  const renderModal = () => {
    if (!showModal) return null;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Paramètres</h3>
              <p className="card-text">Nom d'utilisateur : {info.username}</p>
              <p className="card-text">Email : {info.email}</p>
              <button className='btn btn-primary' onClick={() => setShowModal(true)}>Changer le mot de passe</button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Douve</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group mb-3">
            <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Changer le mot de passe</h5>
              <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={send}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group">
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <input type="password" className="form-control" name="password1" onChange={change} />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <input type="password" className="form-control" name="password2" onChange={change} />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                  <input type="password" className="form-control" name="password3" onChange={change} />
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Fermer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {renderModal()}
    </div>
  );
}
