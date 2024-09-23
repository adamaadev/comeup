import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Foire({ id, symbol }) {
    const [modalQuestion, setModalQuestion] = useState(null); // State to manage modal question
    const [selectedResponse, setSelectedResponse] = useState(""); // State for selected response
    const [justification, setJustification] = useState(""); // State for justification
    const [existingQuestions, setExistingQuestions] = useState([]);
    const [existingResponses, setExistingResponses] = useState({}); // State to store existing responses

    useEffect(() => {
        // Récupérer les questions existantes depuis votre backend lors du chargement initial
        axios.get('http://localhost:4000/getExistingQuestions')
            .then(response => {
                const existingQuestions = response.data;
                setExistingQuestions(existingQuestions); // Mettre à jour l'état avec les questions existantes récupérées

                // Récupérer les réponses existantes pour chaque question
                fetchExistingResponses(existingQuestions);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des questions existantes :', error);
            });
    }, []);

    // Fonction pour vérifier si une question existe déjà
    const isQuestionExisting = (question) => {
        return existingQuestions.includes(question);
    };

    // Fonction pour ouvrir la modale avec la question sélectionnée
    const handleModalOpen = (question) => {
        setModalQuestion(question);

        // Si la question existe déjà, remplir le formulaire avec les données existantes
        if (existingResponses[question]) {
            setSelectedResponse(existingResponses[question].response);
            setJustification(existingResponses[question].justification);
        } else {
            setSelectedResponse("");
            setJustification("");
        }
    };

    // Fonction pour fermer la modale
    const handleModalClose = () => {
        setModalQuestion(null);
        setSelectedResponse("");
        setJustification("");
    };

    // Fonction pour gérer le changement de réponse sélectionnée
    const handleResponseChange = (event) => {
        setSelectedResponse(event.target.value);
    };

    // Fonction pour gérer le changement de justification
    const handleJustificationChange = (event) => {
        setJustification(event.target.value);
    };

    // Fonction pour soumettre la réponse
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:4000/sendquestion', { id, symbol, modalQuestion, selectedResponse, justification })
            .then(response => {
                setSelectedResponse("");
                setJustification("");
                setModalQuestion(null);
                // Mettre à jour les réponses existantes après modification
                fetchExistingResponses(existingQuestions);
            })
            .catch(error => {
                console.error('Erreur lors de la soumission de la réponse :', error);
            });
    };

    // Fonction pour récupérer les réponses existantes depuis le backend
    const fetchExistingResponses = (questions) => {
        axios.post('http://localhost:4000/getExistingResponses', { questions })
            .then(response => {
                setExistingResponses(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des réponses existantes :', error);
            });
    };

    return (
        <div>
            <div className="mt-4">
                <h4>Les produits</h4>
                <ul>
                    {questionsByCategory.produits.map((question, index) => (
                        <li key={index}>
                            {isQuestionExisting(question) ? (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                                </>
                            ) : (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                <h4 className="mt-4">Le positionnement</h4>
                <ul>
                    {questionsByCategory.positionnement.map((question, index) => (
                        <li key={index}>
                            {isQuestionExisting(question) ? (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                                </>
                            ) : (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                <h4 className="mt-4">Le management</h4>
                <ul>
                    {questionsByCategory.management.map((question, index) => (
                        <li key={index}>
                            {isQuestionExisting(question) ? (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                                </>
                            ) : (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                <h4 className="mt-4">Autres questions</h4>
                <ul>
                    {questionsByCategory.autres.map((question, index) => (
                        <li key={index}>
                            {isQuestionExisting(question) ? (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Modifier</button>
                                </>
                            ) : (
                                <>
                                    {question}
                                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modale pour répondre ou modifier les questions */}
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
                                        Fermer
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
