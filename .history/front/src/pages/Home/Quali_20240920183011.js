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
  }, [id,symbol,score]);

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
      
       <div className='card'></div>
    </div>
  );
}
