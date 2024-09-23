import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Douve from './Douve.js';
import Scenario from './Scenario.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faReply } from '@fortawesome/free-solid-svg-icons';
import { questionsByCategory } from '../Services/Questions';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Foire({ symbol }) {
  const [id, setId] = useState(null);
  const [modalQuestion, setModalQuestion] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState("");
  const [justification, setJustification] = useState("");
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [existingResponses, setExistingResponses] = useState({});
  const [score, setScore] = useState(0);
  const [infos, setInfos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    axios.post('http://localhost:4000/', { type: "admin" })
      .then(res => setId(res.data.id));
  }, []);

  useEffect(() => {
    if (id && symbol) {
      axios.post('http://localhost:4000/getExistingQuestions', { id, symbol })
        .then(res => {
          setExistingQuestions(res.data);
        });

      axios.post('http://localhost:4000/checkscore', { id, symbol })
        .then(res => {
          setInfos(res.data);
          calculateScore(res.data);
        });
    }
  }, [id, symbol]);

  const calculateScore = (responses) => {
    let calculatedScore = 0;
    responses.forEach(response => {
      if (response.reponse === 'oui') {
        calculatedScore += 1;
      } else if (response.reponse === 'neutre') {
        calculatedScore += 0.5;
      }
    });
    setScore(calculatedScore);
  };

  const isQuestionExisting = (question) => {
    return existingQuestions.includes(question);
  };

  const handleModalOpen = (question) => {
    setModalQuestion(question);
    setSelectedResponse(existingResponses[question]?.response || "");
    setJustification(existingResponses[question]?.justification || "");
    setShowModal(true);
  };

  const handleModalClose = () => {
    setModalQuestion(null);
    setSelectedResponse("");
    setJustification("");
    setShowModal(false);
  };

  const handleResponseChange = (event) => {
    setSelectedResponse(event.target.value);
  };

  const handleJustificationChange = (event) => {
    setJustification(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const endpoint = isQuestionExisting(modalQuestion) ? 'updateQuestion' : 'sendquestion';

    axios.post(`http://localhost:4000/${endpoint}`, { id, symbol, modalQuestion, selectedResponse, justification })
      .then(() => {
        setSelectedResponse("");
        setJustification("");
        setModalQuestion(null);
        setShowModal(false);

        axios.post('http://localhost:4000/checkscore', { id, symbol })
          .then(res => {
            setInfos(res.data);
            calculateScore(res.data);
          });
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de la réponse :', error);
      });
  };

  const handleResetQuestions = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les questions ?")) {
      axios.post('http://localhost:4000/resetQuestions', { id, symbol })
        .then(() => {
          setExistingQuestions([]);
          setInfos([]);
          setScore(0);
        })
        .catch(error => {
          console.error('Erreur lors de la réinitialisation des questions :', error);
        });
    }
  };

  const getProgressBarClass = () => {
    if (score >= 0 && score <= 10) {
      return 'bg-danger';
    } else if (score >= 11 && score <= 15) {
      return 'bg-warning';
    } else if (score >= 16 && score <= 20) {
      return 'bg-success';
    } else {
      return 'bg-secondary'; 
    }
  };

  return (
    <div className="container mt-4">
        <div className="row">
        <div className="col-6">
          <Douve/>
        </div>
        <div className="col-6">
           <Douve/>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <button>btn3</button>
        </div>
        <div className="col-6">
          <Scenario/>
        </div>
      </div>
      <div className="mt-4">
        <h4>Quanti-Score : {score} / 20</h4>
        <div className="progress">
          <div
            className={`progress-bar ${getProgressBarClass()}`}
            role="progressbar"
            style={{ width: `${(score / 20) * 100}%` }}
            aria-valuenow={score}
            aria-valuemin="0"
            aria-valuemax="20"
          ></div>
        </div>
      </div>

      <div className="mt-4">
        {existingQuestions.length > 0 && (
          <Button 
            variant="danger"
            onClick={handleResetQuestions}
          >
            Réinitialiser les questions
          </Button>
        )}
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Les produits</h4>
          <ul className="list-unstyled">
            {questionsByCategory.produits.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faPen} /> {/* Icône pour "Modifier" */}
                    </Button>
                  ) : (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faReply} /> {/* Icône pour "Répondre" */}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h4>Le positionnement</h4>
          <ul className="list-unstyled">
            {questionsByCategory.positionnement.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faPen} /> {/* Icône pour "Modifier" */}
                    </Button>
                  ) : (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faReply} /> {/* Icône pour "Répondre" */}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Le management</h4>
          <ul className="list-unstyled">
            {questionsByCategory.management.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faPen} /> {/* Icône pour "Modifier" */}
                    </Button>
                  ) : (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faReply} /> {/* Icône pour "Répondre" */}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h4>Autres questions</h4>
          <ul className="list-unstyled">
            {questionsByCategory.autres.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faPen} /> {/* Icône pour "Modifier" */}
                    </Button>
                  ) : (
                    <Button variant="primary" className="ml-2" onClick={() => handleModalOpen(question)}>
                      <FontAwesomeIcon icon={faReply} /> {/* Icône pour "Répondre" */}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalQuestion && (
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{existingResponses[modalQuestion] ? 'Modifier la réponse' : 'Répondre à la question'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <p>{modalQuestion}</p>
              <Form.Group controlId="response">
                <Form.Label>Réponse :</Form.Label>
                <Form.Control 
                  as="select"
                  value={selectedResponse}
                  onChange={handleResponseChange}
                  required
                >
                  <option value=""></option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                  <option value="neutre">Neutre</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="justification">
                <Form.Label>Justification :</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows="3"
                  value={justification}
                  onChange={handleJustificationChange}
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="primary">Enregistrer</Button>
              <Button variant="secondary" onClick={handleModalClose}>Fermer</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </div>
  );
}
