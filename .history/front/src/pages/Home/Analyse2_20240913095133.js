import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Card } from "react-bootstrap";
import Logoanalyse from "../Assets/Analyse.png";

export default function Analyse2({ id, symbol }) {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [selectedDouve, setSelectedDouve] = useState("");
  const [justification, setJustification] = useState("");
  const [scenarioResponses, setScenarioResponses] = useState([]);
  const [douveResponses, setDouveResponses] = useState([]);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showDouveModal, setShowDouveModal] = useState(false);

  // Fetch scenario data
  useEffect(() => {
    axios.post("http://localhost:4000/scenario/list", { symbol, id })
      .then((response) => {
        if (response.data) {
          setScenarioResponses(response.data);
        }
      })
  }, [symbol, id]);

  // Fetch douve data
  useEffect(() => {
    axios.post('http://localhost:4000/douve/list', { symbol, id })
      .then((res) => {
        setDouveResponses(res.data);
      })
      .catch(err => console.error('Erreur lors de la récupération des données:', err));
  }, [id, symbol]);

  // Submit scenario
  const handleScenarioSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/scenario/add", { symbol, reponse: selectedScenario, justification, id_user: id })
      .then((response) => {
        if (response.data) {
          setScenarioResponses([...scenarioResponses, response.data]);
        }
        setShowScenarioModal(false);
        setSelectedScenario("");
        setJustification("");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du scénario:", error);
      });
  };

  // Submit douve
  const handleDouveSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/douve/add', { symbol, reponse: selectedDouve, justification, id_user: id })
      .then((response) => {
        setDouveResponses([...douveResponses, response.data]);
        setShowDouveModal(false);
        setSelectedDouve("");
        setJustification("");
      })
      .catch(err => console.error('Erreur lors de l\'ajout de la douve:', err));
  };

  // Delete scenario
  const handleScenarioDelete = (scenarioId) => {
    axios.delete(`http://localhost:4000/scenario/delete/${scenarioId}`)
      .then(() => {
        setScenarioResponses(scenarioResponses.filter(response => response.id !== scenarioId));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du scénario:", error);
      });
  };

  // Delete douve
  const handleDouveDelete = (douveId) => {
    axios.delete(`http://localhost:4000/douve/delete/${douveId}`)
      .then(() => {
        setDouveResponses(douveResponses.filter(response => response.id !== douveId));
      })
      .catch(err => console.error('Erreur lors de la suppression:', err));
  };

  const styles = {
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    image: {
      width: '100px',
      marginBottom: '10px',
    },
    card: {
      width: '100%',
      marginBottom: '10px',
    },
    col: {
      marginBottom: '10%',
    }
  };

  return (
    <div className="container">
  {/* Scenarios & Douves Section */}
  <div className="row">
    {/* Douves Card */}
    <div className="col-md-6">
      <Card style={styles.card}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Les douves</h5>
          <span className="badge bg-success">{douveResponses.length}</span>
        </div>
        <Card.Body>
          {douveResponses.length === 0 ? (
            <div style={styles.imageContainer}>
              <img src={Logoanalyse} alt="No douves" style={styles.image} />
              <p>Aucune douve n'a été définie !</p>
            </div>
          ) : (
            <ul className="list-group">
              {douveResponses.map((response) => (
                <li key={response.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {response.reponse}
                  <Button variant="danger" size="sm" onClick={() => handleDouveDelete(response.id)}>X</Button>
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
    {/* Scenarios Card */}
    <div className="col-md-6">
      <div className="card" style={styles.card}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Les scénarios catastrophes</h5>
          <span className="badge bg-danger">{scenarioResponses.length}</span>
        </div>
        <div className="card-body text-center">
          {scenarioResponses.length === 0 ? (
            <div style={styles.imageContainer}>
              <img src={Logoanalyse} alt="No scenarios" style={styles.image} />
              <p>Aucun scénario catastrophe n'a été défini !</p>
            </div>
          ) : (
            <ul className="list-group">
              {scenarioResponses.map((response) => (
                <li key={response.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {response.reponse}
                  <Button variant="danger" size="sm" onClick={() => handleScenarioDelete(response.id)}>X</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card-footer text-center">
          <Button variant="primary" onClick={() => setShowScenarioModal(true)}>+ Ajouter un scénario</Button>
        </div>
      </div>
    </div>

  </div>

  {/* Modales */}
  {/* Modale pour ajouter un scénario */}
  <Modal show={showScenarioModal} onHide={() => setShowScenarioModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Ajouter un scénario</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleScenarioSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Scénario :</Form.Label>
          <Form.Control
            type="text"
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
          
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Justification :</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          
          />
        </Form.Group>
        <Button type="submit" variant="primary">Soumettre</Button>
      </Form>
    </Modal.Body>
  </Modal>

  {/* Modale pour ajouter une douve */}
  <Modal show={showDouveModal} onHide={() => setShowDouveModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Ajouter une douve</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleDouveSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Sélectionnez une option :</Form.Label>
          <Form.Control
            as="select"
            value={selectedDouve}
            onChange={(e) => setSelectedDouve(e.target.value)}
          
          >
            <option value="" disabled>-- Choisissez une option --</option>
            <option value="grande douve">Grande douve</option>
            <option value="petite douve">Petite douve</option>
            <option value="aucune douve">Aucune douve</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Justification :</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
          
          />
        </Form.Group>
        <Button type="submit" variant="primary">Soumettre</Button>
      </Form>
    </Modal.Body>
  </Modal>
</div>

  );
}
