import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import Logoanalyse from "../Assets/Analyse.png";

export default function Analyse2({ id, symbol }) {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [justification, setJustification] = useState("");
  const [responses, setResponses] = useState([]);
  const [showScenarioModal, setShowScenarioModal] = useState(false);

  useEffect(() => {
    axios.post("http://localhost:4000/scenario/list", { symbol, id })
      .then((response) => {
        if (response.data) {
          setResponses(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching scenarios:", error);
      });
  }, [symbol, id]);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:4000/scenario/add", { symbol, reponse: selectedScenario, justification, id_user: id })
      .then((response) => {
        if (response.data) {
          setResponses([...responses, response.data]);
        }
        setShowScenarioModal(false);
        setSelectedScenario("");
        setJustification("");
      })
      .catch((error) => {
        console.error("Error adding scenario:", error);
      });
  }

  function handleDelete(scenarioId) {
    axios.delete(`http://localhost:4000/scenario/delete/${scenarioId}`)
      .then(() => {
        setResponses(responses.filter(response => response.id !== scenarioId));
      })
      .catch((error) => {
        console.error("Error deleting scenario:", error);
      });
  }

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
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.card}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Les scénarios</h5>
              <span className="badge bg-info">{responses.length}</span>
            </div>
            <div className="card-body text-center">
              {responses.length === 0 ? (
                <div style={styles.imageContainer}>
                  <img src={Logoanalyse} alt="No scenarios" style={styles.image} />
                  <p>Aucun scénario n'a été défini !</p>
                </div>
              ) : (
                <ul className="list-group">
                  {responses.map((response, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {response.reponse}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(response.id)}>X</Button>
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

      {/* Modale pour ajouter un scénario */}
      <Modal show={showScenarioModal} onHide={() => setShowScenarioModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un scénario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Scénario :</Form.Label>
              <Form.Control
                type="text"
                value={selectedScenario}
                onChange={e => setSelectedScenario(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Justification :</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                value={justification}
                onChange={e => setJustification(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Soumettre</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
