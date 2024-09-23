import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Foire({ id, symbol }) {
    const [modalQuestion, setModalQuestion] = useState(null); // State to manage modal question
    const [selectedResponse, setSelectedResponse] = useState(""); // State for selected response
    const [justification, setJustification] = useState(""); // State for justification
    const [existingQuestions, setExistingQuestions] = useState([]);
    const [existingResponses, setExistingResponses] = useState({}); // State to store existing responses

    const questionsByCategory = {
        produits: [
            "Est ce que les produits sont considérées comme essentiels ou indispensables pour les consommateurs ou clients ?",
            "Est ce que les produits sont achetés de manière régulière ou récurrentes par les consommateurs ou le clients ?",
            "Est-ce que les produits sont adoptés par une base diversifiée de client ?",
            "Est-ce que les produit sont proposés à des prix compétitifs ou bas ?",
            "Est-ce que les produits sont résiliants face aux évolutions du marché ou aux changements technologique ?",
            "Les ventes sont-elles prévisibles et régulières ? (Consommable, abonnement)"
        ],
        positionnement: [
            "Les clients expriment-ils généralement une satisfaction élevée à l’égard des produits ou service de l’entreprise ?",
            "L’entreprise propose-t-elle des produits ou services uniques, se démarquant clairement de la concurrence ?",
            "L’entreprise est-elle leader dans son marché / industrie ?",
            "L’entreprise fait-elle preuve de résilience face à la concurrence, en maintenant ou en renforçant sa position sur le marché malgré les pressions concurrentielles ?",
            "L’entreprise peut-elle augmenter ses prix facilement, sans répercussion majeure ?",
            "L’entreprise opère-t-elle à l’échelle internationale ?"
        ],
        management: [
            "Est-ce que l’entreprise alloue efficacement son capital ? (Disponible sur le rapport de Morningstar).",
            "L’entreprise est-elle facile à gérer ?",
            "L’entreprise met-elle l’accent sur la qualité de ses produits ?",
            "Le management de l’entreprise est-il compétent ?",
            "Le management a-t-il un intérêt financier dans l’entreprise ? (Possède-t-il des parts, s’agit-il d’une entreprise familiale, le CEO possède-t-il des primes ou des bonus liés aux résultats de l’entreprise ?)",
            "Est-ce que l’entreprise privilégie les intérêts de ses actionnaires ? (Généreux programmes de retour aux actions, que ce soit les dividendes ou les rachats d’actions)"
        ],
        autres: [
            "Est-ce que l’entreprise présente des perspectives de croissances significatives ?",
            "Est-ce que l’entreprise opère dans un secteur en expansion ?"
        ]
    };

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
                                <h5 className="modal-title">Répondre à la question</h5>
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
                                        Soumettre
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
