import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logoanalyse from '../Assets/Analyse.png';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Analyse({ id, symbol }) {
  const [force, setForce] = useState("");
  const [risque, setRisque] = useState("");
  const [forces, setForces] = useState([]);
  const [risques, setRisques] = useState([]);
  const [showForceModal, setShowForceModal] = useState(false);
  const [showRisqueModal, setShowRisqueModal] = useState(false);

  function List() {
    axios.post('http://localhost:4000/listanalyse', { symbol, id })
      .then(res => {
        const forcesData = res.data.filter(item => item.type === 'force');
        const risquesData = res.data.filter(item => item.type === 'risque');
        setForces(forcesData);
        setRisques(risquesData);
      });
  }

  useEffect(() => {
    List();
  }, []);

  const sendForce = (e) => {
    e.preventDefault();
    if (force.trim().length > 0) {
      axios.post('http://localhost:4000/sendforce', { symbol, id, force }).then(() => {
        setForce('');
        setShowForceModal(false); // Fermer la modale après soumission
        List(); // Rafraîchir la liste après ajout
      });
    }
  };

  const sendRisque = (e) => {
    e.preventDefault();
    if (risque.trim().length > 0) {
      axios.post('http://localhost:4000/sendrisque', { symbol, id, risque }).then(() => {
        setRisque('');
        setShowRisqueModal(false); // Fermer la modale après soumission
        List(); // Rafraîchir la liste après ajout
      });
    }
  };

  const supprimer = (index) => {
    axios.post('http://localhost:4000/deleteanalyse', { index }).then(() => {
      List();
    });
  };

  const handleForceModalClose = () => setShowForceModal(false);
  const handleRisqueModalClose = () => setShowRisqueModal(false);

  const styles = {
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    image: {
      width: '100px', // Augmenter la largeur ici
      marginBottom: '10px',
    },
    card: {
      width: '150%',
      marginBottom: '20px',
       // Espace entre les cartes
    },
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <div className="card" style={styles.card}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Les forces</h5>
              <span className="badge bg-success">{forces.length}</span>
            </div>
            <div className="card-body text-center">
              {forces.length === 0 ? (
                <div style={styles.imageContainer}>
                  <img src={Logoanalyse} alt="No forces" style={styles.image} />
                  <p>Aucune force n'a été définie !</p>
                </div>
              ) : (
                <ul className="list-group">
                  {forces.map((forceItem, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {forceItem.content}
                      <Button variant="danger" size="sm" onClick={() => supprimer(forceItem.id)}>Supprimer</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer text-center">
              <Button variant="link" onClick={() => setShowForceModal(true)}>+ Ajouter une force</Button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 mb-4">
          <div className="card" style={styles.card}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Les risques</h5>
              <span className="badge bg-danger">{risques.length}</span>
            </div>
            <div className="card-body text-center">
              {risques.length === 0 ? (
                <div style={styles.imageContainer}>
                  <img src={Logoanalyse} alt="No risks" style={styles.image} />
                  <p>Aucun risque n'a été défini !</p>
                </div>
              ) : (
                <ul className="list-group">
                  {risques.map((risqueItem, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {risqueItem.content}
                      <Button variant="danger" size="sm" onClick={() => supprimer(risqueItem.id)}>Supprimer</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer text-center">
              <Button variant="link" onClick={() => setShowRisqueModal(true)}>+ Ajouter un risque</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modale pour les forces */}
      <Modal show={showForceModal} onHide={handleForceModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une force</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={sendForce}>
            <Form.Group>
              <Form.Label>Force :</Form.Label>
              <Form.Control
                type="text"
                value={force}
                onChange={e => setForce(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Soumettre</Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modale pour les risques */}
      <Modal show={showRisqueModal} onHide={handleRisqueModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un risque</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={sendRisque}>
            <Form.Group>
              <Form.Label>Risque :</Form.Label>
              <Form.Control
                type="text"
                value={risque}
                onChange={e => setRisque(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Soumettre</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
