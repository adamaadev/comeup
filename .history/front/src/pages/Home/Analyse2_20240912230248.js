import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logoanalyse from '../Assets/Analyse.png';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Analyse2({ id, symbol }) {
  const [force, setForce] = useState("");
  const [risque, setRisque] = useState("");
  const [forces, setForces] = useState([]);
  const [risques, setRisques] = useState([]);
  const [showForceModal, setShowForceModal] = useState(false);
  const [showRisqueModal, setShowRisqueModal] = useState(false);

  // Fonction pour récupérer les forces et les risques
  function List() {
    axios.post('http://localhost:4000/listanalyse', { symbol, id })
      .then(res => {
        console.log('Données reçues:', res.data);
        const forcesData = res.data.filter(item => item.type === 'force');
        const risquesData = res.data.filter(item => item.type === 'risque');
        setForces(forcesData);
        setRisques(risquesData);
      })
      .catch(err => console.error('Erreur lors de la récupération des données:', err));
  }

  // Utilisation de useEffect pour appeler List lors du montage du composant ou lorsque id ou symbol changent
  useEffect(() => {
    List();
  }, [id, symbol]);

  // Fonction pour envoyer une force
  const sendForce = (e) => {
    e.preventDefault();
    if (force.trim().length > 0) {
      axios.post('http://localhost:4000/sendforce', { symbol, id, force })
        .then(() => {
          setForce('');
          setShowForceModal(false);
          List();  // Met à jour la liste après l'ajout
        })
        .catch(err => console.error('Erreur lors de l\'ajout de la force:', err));
    }
  };

  // Fonction pour envoyer un risque
  const sendRisque = (e) => {
    e.preventDefault();
    if (risque.trim().length > 0) {
      axios.post('http://localhost:4000/sendrisque', { symbol, id, risque })
        .then(() => {
          setRisque('');
          setShowRisqueModal(false);
          List();  // Met à jour la liste après l'ajout
        })
        .catch(err => console.error('Erreur lors de l\'ajout du risque:', err));
    }
  };

  // Fonction pour supprimer une entrée
  const supprimer = (itemId) => {
    axios.delete(`http://localhost:4000/deleteanalyse/${itemId}`)
      .then(() => {
        List();  // Met à jour la liste après la suppression
      })
      .catch(err => console.error('Erreur lors de la suppression:', err));
  };

  return (
    <div className="container">
      <div className="row">
        {/* Card pour les forces */}
        <div className="col-12 col-md-6 mb-4">
          <div className="card" style={{ width: '100%', marginBottom: '0px' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Les forces</h5>
              <span className="badge bg-success">{forces.length}</span>
            </div>
            <div className="card-body text-center">
              {forces.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <img src={Logoanalyse} alt="No forces" style={{ width: '100px', marginBottom: '10px' }} />
                  <p>Aucune force n'a été définie !</p>
                </div>
              ) : (
                <ul className="list-group">
                  {forces.map((forceItem, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {forceItem.content}
                      <Button variant="danger" size="sm" onClick={() => supprimer(forceItem.id)}>X</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer text-center">
              <Button variant="primary" onClick={() => setShowForceModal(true)}>+ Ajouter une force</Button>
            </div>
          </div>
        </div>

        {/* Card pour les risques */}
        <div className="col-12 col-md-6 mb-4">
          <div className="card" style={{ width: '100%', marginBottom: '0px' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Les risques</h5>
              <span className="badge bg-danger">{risques.length}</span>
            </div>
            <div className="card-body text-center">
              {risques.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <img src={Logoanalyse} alt="No risks" style={{ width: '100px', marginBottom: '10px' }} />
                  <p>Aucun risque n'a été défini !</p>
                </div>
              ) : (
                <ul className="list-group">
                  {risques.map((risqueItem, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {risqueItem.content}
                      <Button variant="danger" size="sm" onClick={() => supprimer(risqueItem.id)}>X</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer text-center">
              <Button variant="primary" onClick={() => setShowRisqueModal(true)}>+ Ajouter un risque</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modale pour les forces */}
      <Modal show={showForceModal} onHide={() => setShowForceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une force</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={sendForce}>
            <Form.Group>
              <Form.Label>Force :</Form.Label>
              <Form.Control
                type="text"
                value={force}
                onChange={e => setForce(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Soumettre</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modale pour les risques */}
      <Modal show={showRisqueModal} onHide={() => setShowRisqueModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un risque</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={sendRisque}>
            <Form.Group>
              <Form.Label>Risque :</Form.Label>
              <Form.Control
                type="text"
                value={risque}
                onChange={e => setRisque(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Soumettre</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
