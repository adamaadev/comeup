import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faReply } from '@fortawesome/free-solid-svg-icons';
import { questionsByCategory } from '../Services/Questions.js';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Analyse from './Analyse.js';
import Analyse2 from './Analyse2.js';

export default function Quali({ symbol }) {
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
    axios.post('http://localhost:4000/', { type: "user" })
      .then(res => setId(res.data.id));
    submitScore()
  }, []);

  useEffect(() => {
    submitScore()
  }, [id, symbol, score]);

  const submitScore = () => {
    axios.post('http://localhost:4000/submitscore', { id, symbol, score })
      .then(() => {
        console.log('Score envoyé avec succès');
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du score :', error);
      });
  };

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

        // Actualiser le score après l'ajout
        axios.post('http://localhost:4000/checkscore', { id, symbol })
          .then(res => {
            setInfos(res.data);
            calculateScore(res.data);
            submitScore();  // Envoyer le score au serveur
          });

        // Rafraîchir la liste des questions existantes
        axios.post('http://localhost:4000/getExistingQuestions', { id, symbol })
          .then(res => {
            setExistingQuestions(res.data);
          });
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de la réponse :', error);
      });
  };


  const handleResetQuestions = () => {
    axios.post('http://localhost:4000/resetQuestions', { id, symbol })
      .then(() => {
        setExistingQuestions([]);
        setInfos([]);
        setScore(0);
      })
      .catch(error => {
        console.error('Erreur lors de la réinitialisation des questions :', error);
      });
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

      <div className='card' style={{ border: 'none' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <h4 style={{ margin: 0 }}>Analyse qualitative</h4>
          <h4 style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
            Quali-score :
            <div className="progress" style={{ width: '150px', margin: '10px 0 5px 5px', position: 'relative', height: '20px', backgroundColor: '#d3d3d3', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                className={`progress-bar ${getProgressBarClass()}`}
                role="progressbar"
                style={{ width: `${(score / 20) * 100}%`, height: '100%', backgroundColor: '#007bff', transition: 'width 0.5s ease' }}
                aria-valuenow={score}
                aria-valuemin="0"
                aria-valuemax="20"
              >
                <span style={{ position: 'absolute', right: 0, left: 0, color: 'white', textAlign: 'center', width: '100%', fontSize: '12px' }}>
                  {score} / 20
                </span>
              </div>
            </div>
          </h4>
        </div>
        <br />
        <div className="row">

          <div className="col-80">
            <Analyse id={id} symbol={symbol} />
          </div>
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
          <div className="mt-4 d-flex justify-content-center">
            {existingQuestions.length > 0 && (
              <Button
                variant="danger"
                onClick={handleResetQuestions}
              >
                Réinitialiser l'analyse
              </Button>
            )}
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-60">
            <Analyse2 id={id} symbol={symbol} />
          </div>
        </div>


        {modalQuestion && (
          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
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
                  >
                    <option value=""></option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                    <option value="neutre">Partiellement</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="justification">
                  <Form.Label>Pourquoi :</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder='Expliquer votre choix '
                    rows="3"
                    value={justification}
                    onChange={handleJustificationChange}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" variant="primary">Valider</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}
      </div>
    </div>
  );
}
