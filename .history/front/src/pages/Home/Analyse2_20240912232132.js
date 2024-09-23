import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logoanalyse from '../Assets/Analyse.png';
import { Modal, Button, Form, Card } from 'react-bootstrap';

export default function Analyse2({ id, symbol }) {
  const [selectedDouve, setSelectedDouve] = useState("");
  const [justification, setJustification] = useState("");
  const [responses, setResponses] = useState([]);
  const [showDouveModal, setShowDouveModal] = useState(false);

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    axios.post('http://localhost:4000/douve/list', { symbol, id })
      .then((res) => {
        setResponses(res.data);
      })
      .catch(err => console.error('Erreur lors de la récupération des données:', err));
  }, [id, symbol]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/douve/add', { symbol, reponse: selectedDouve, justification, id_user: id })
      .then((response) => {
        setResponses(prevResponses => [...prevResponses, response.data]);
        setShowDouveModal(false);
        setSelectedDouve("");
        setJustification("");
      })
      .catch(err => console.error('Erreur lors de l\'ajout de la douve:', err));
  };

  const handleDelete = (douveId) => {
    axios.delete(`http://localhost:4000/douve/delete/${douveId}`)
      .then(() => {
        setResponses(responses.filter(response => response.id !== douveId));
      })
      .catch(err => console.error('Erreur lors de la suppression:', err));
  };

  const handleModalClose = () => setShowDouveModal(false);

  const styles = {
    card: {
      width: '100%',
      marginBottom: '10px',
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    image: {
      width: '100px',
      marginBottom: '10px',
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mb-4">
          <Card style={styles.card}>
          <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Les douves</h5>
              <span className="badge bg-success">{responses.length}</span>
            </div>
            <Card.Body>
              {responses.length === 0 ? (
                <div style={styles.imageContainer}>
                    <img src={Logoanalyse} alt="No forces" style={styles.image} />
                    <p>Aucune douve n'a été définie !</p>
               </div>
              ) : (
                <ul className="list-group">
                  {responses.map((response) => (
                    <li key={response.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {response.reponse}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(response.id)}>X</Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="primary" onClick={() => setShowDouveModal(true)}>+ Ajouter une douve</Button>
            </Card.Footer>
          </Card>
        </div>
      </div>

      {/* Modale pour ajouter une douve */}
      <Modal show={showDouveModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une douve</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Sélectionnez une option :</Form.Label>
              <Form.Control
                as="select"
                value={selectedDouve}
                onChange={(e) => setSelectedDouve(e.target.value)}
                required
              >
                <option value="" disabled>-- Choisissez une option --</option>
                <option value="grande_douve">Grande douve</option>
                <option value="petite_douve">Petite douve</option>
                <option value="aucune_douve">Aucune douve</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Justification :</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Soumettre</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
