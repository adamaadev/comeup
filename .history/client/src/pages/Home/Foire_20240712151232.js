import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { questionsByCategory } from './Questions';

export default function Foire({ symbol }) {
  const [id, setId] = useState(null);
  const [modalQuestion, setModalQuestion] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState("");
  const [justification, setJustification] = useState("");
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [existingResponses, setExistingResponses] = useState({});
  const [score, setScore] = useState(0);
  const [infos, setInfos] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/');
        setId(response.data.id);
      } catch (error) {
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchExistingQuestions = async () => {
        try {
          const response = await axios.post('http://localhost:4000/getExistingQuestions', { id, symbol });
          const existingQuestions = response.data;
          setExistingQuestions(existingQuestions);
          const scoreResponse = await axios.post('http://localhost:4000/checkscore', { id, symbol });
          setInfos(scoreResponse.data);
          calculateScore(scoreResponse.data);
        } catch (error) {
        }
      };

      fetchExistingQuestions();
    }
  }, [id, symbol]);

  const calculateScore = (responses) => {
    let calculatedScore = 0;
    responses.forEach(response => {
      if (response.reponse === 'oui') {
        calculatedScore += 1;
      } else if (response.reponse === 'non') {
        calculatedScore += 0;
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

    if (existingResponses[question]) {
      setSelectedResponse(existingResponses[question].response);
      setJustification(existingResponses[question].justification);
    } else {
      setSelectedResponse("");
      setJustification("");
    }
  };

  const handleModalClose = () => {
    setModalQuestion(null);
    setSelectedResponse("");
    setJustification("");
  };

  const handleResponseChange = (event) => {
    setSelectedResponse(event.target.value);
  };

  const handleJustificationChange = (event) => {
    setJustification(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:4000/sendquestion', { id, symbol, modalQuestion, selectedResponse, justification });
      setSelectedResponse("");
      setJustification("");
      setModalQuestion(null);
      fetchExistingResponses(existingQuestions);
      const scoreResponse = await axios.post('http://localhost:4000/checkscore', { id, symbol });
      setInfos(scoreResponse.data);
      calculateScore(scoreResponse.data);
    } catch (error) {
    }
  };

  const fetchExistingResponses = (questions) => {
  };

  const getProgressBarClass = () => {
    if (score >= 0 && score <= 10) {
      return 'bg-danger';
    } else if (score >= 11 && score <= 15) {
      return 'bg-warning';
    } else if (score >= 16 && score <= 20) {
      return 'bg-success';
    } else {
      return 'bg-secondary'; // Default color if the score is out of the expected range
    }
  };

  return (
    <div>
      <div className="mt-4">
      <div className="mt-4">
        <h4>Score : {score} / 20</h4>
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
        <div>
          <h4>Les produits</h4>
          <ul>
            {questionsByCategory.produits.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                  ) : (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4>Le positionnement</h4>
          <ul>
            {questionsByCategory.positionnement.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                  ) : (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4>Le management</h4>
          <ul>
            {questionsByCategory.management.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                  ) : (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h4>Autres questions</h4>
          <ul>
            {questionsByCategory.autres.map((question, index) => (
              <li key={index} className="d-flex justify-content-between align-items-center">
                <span>{question}</span>
                <div>
                  {isQuestionExisting(question) ? (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                  ) : (
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalQuestion && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{existingResponses[modalQuestion] ? 'Modifier la réponse' : 'Répondre à la question'}</h5>
                <button type="button" className="close" onClick={handleModalClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <p>{modalQuestion}</p>
                  <div className="form-group">
                    <label htmlFor="response">Réponse :</label>
                    <select
                      className="form-control"
                      id="response"
                      value={selectedResponse}
                      onChange={handleResponseChange}
                      required
                    >
                      <option value=""></option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                      <option value="neutre">Neutre</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="justification">Justification :</label>
                    <textarea
                      className="form-control"
                      id="justification"
                      rows="3"
                      value={justification}
                      onChange={handleJustificationChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {existingResponses[modalQuestion] ? 'Modifier' : 'Soumettre'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
