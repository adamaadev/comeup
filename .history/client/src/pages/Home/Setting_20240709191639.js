import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Setting() {
  const [activeTab, setActiveTab] = useState('account');
  const [showModal, setShowModal] = useState(false);
  const [info, setInfo] = useState({ username: '', email: '' });
  const [infos, setInfos] = useState({ password1: '', password2: '', password3: '' });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        setEmail(res.data.email);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération de l\'email : ', err);
      });
  }, []);

  function change(e) {
    setError('');
    setInfos({ ...infos, [e.target.name]: e.target.value });
  }

  function send(e) {
    e.preventDefault();
    if (infos.password2 !== infos.password3) {
      setError('Les mots de passe ne correspondent pas !');
    } else if (!infos.password1 || !infos.password2 || !infos.password3) {
      setError('Remplissez tous les champs !');
    } else if (infos.password1 === infos.password2) {
      setError('Saisissez un mot de passe différent de l\'ancien');
    } else {
      axios.post('http://localhost:4000/changepassword', { email, infos })
        .then(res => {
          if (!res.data.exist) {
            setError('L\'ancien mot de passe est incorrect !');
          } else {
            axios.get('http://localhost:4000/logoutuser')
              .then(res => {
                if (res.data.success) {
                  window.location.reload(true);
                }
              });
          }
        })
        .catch(err => {
          console.error('Erreur lors du changement de mot de passe : ', err);
          setError('Une erreur s\'est produite. Veuillez réessayer.');
        });
    }
  }

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        setInfo({ username: res.data.username, email: res.data.email });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des informations utilisateur : ', error);
      });
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleChangePasswordClick = () => {
    setShowModal(true);
    document.body.classList.add('modal-open');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.body.classList.remove('modal-open');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div>
            <p className="card-text">Email : {info.email}</p>
            <p className="card-text">Nom d'utilisateur : {info.username}</p>
            <button className="btn btn-primary" onClick={handleChangePasswordClick}>Changer le mot de passe</button>
          </div>
        );
      case 'subscription':
        return (
          <div>
            <h4>Mon abonnement</h4>
            <p>Contenu pour Mon abonnement.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
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
    );
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Paramètres</h3>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
                    onClick={() => handleTabClick('account')}
                  >
                    Mon compte
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'subscription' ? 'active' : ''}`}
                    onClick={() => handleTabClick('subscription')}
                  >
                    Mon abonnement
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {renderTabContent()}
        </div>
      </div>
      {renderModal()}
    </div>
  );
}
