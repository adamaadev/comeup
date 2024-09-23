import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { questionsByCategory } from './Questions';

export default function Foire({ id, symbol }) {
    const [modalQuestion, setModalQuestion] = useState(null);
    const [selectedResponse, setSelectedResponse] = useState("");
    const [justification, setJustification] = useState("");
    const [existingQuestions, setExistingQuestions] = useState([]);
    const [existingResponses, setExistingResponses] = useState({});

    useEffect(() => {
        axios.get('http://localhost:4000/getExistingQuestions')
            .then(response => {
                const existingQuestions = response.data;
                setExistingQuestions(existingQuestions);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des questions existantes :', error);
            });
    }, []);

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

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:4000/sendquestion', { id, symbol, modalQuestion, selectedResponse, justification })
            .then(response => {
                setSelectedResponse("");
                setJustification("");
                setModalQuestion(null);
                fetchExistingResponses(existingQuestions);
            })
            .catch(error => {
                console.error('Erreur lors de la soumission de la réponse :', error);
            });
    };



    return (
        <div>
            <div className="mt-4">
                {Object.entries(questionsByCategory).map(([category, questions]) => (
                    <div key={category}>
                        <h4 className="mt-4">{category}</h4>
                        <ul>
                            {questions.map((question, index) => (
                                <li key={index}>
                                    {isQuestionExisting(question) ? (
                                        <>
                                            {question}
                                            <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>
                                                {existingResponses[question] ? 'Modifier' : 'Répondre'}
                                            </button>
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
                ))}
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
