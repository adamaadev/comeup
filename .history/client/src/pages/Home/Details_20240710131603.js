import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Details() {
  const { symbol } = useParams();
  const [exist, setExist] = useState(true);
  const [infos, setInfos] = useState([]);
  const [id, setId] = useState();
  const [force, setForce] = useState("");
  const [risque, setRisque] = useState("");
  const [forces, setForces] = useState([]);
  const [risques, setRisques] = useState([]);
  const [activeTab, setActiveTab] = useState('news');
  const [modalQuestion, setModalQuestion] = useState(null); // State to manage modal question
  const [selectedResponse, setSelectedResponse] = useState("");
  const [justification, setJustification] = useState("");

  // Mocked questions grouped by categories
  const questionsByCategory = {
    produits: [
      "Est-ce que les produits sont considérés comme essentiels ou indispensables pour les consommateurs ou clients ?",
      "Est-ce que les produits sont achetés de manière régulière ou récurrentes par les consommateurs ou le clients ?",
      "Est-ce que les produits sont adoptés par une base diversifiée de client ?",
      "Est-ce que les produits sont proposés à des prix compétitifs ou bas ?",
      "Est-ce que les produits sont résiliants face aux évolutions du marché ou aux changements technologiques ?",
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
      "Est-ce que l’entreprise présente des perspectives de croissance significatives ?",
      "Est-ce que l’entreprise opère dans un secteur en expansion ?"
    ]
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.success) {
          setId(res.data.id);
        }
      });
  }, []);

  useEffect(() => {
    if (symbol && id) {
      axios.post('http://localhost:4000/checkforuser', { symbol, id })
        .then(response => setExist(response.data.exist));
    }
  }, [symbol, id]);

  useEffect(() => {
    axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        setInfos([res.data[0]]) 
        const {companyName , image , symbol , country , mktCap , sector} = res.data[0];
        axios.post('http://localhost:4000/checkcompany',{ companyName , image , symbol , country , mktCap , sector }).then(res=>console.log(res.data))
      });
  }, [symbol]);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/listanalyse', { symbol, id })
        .then(res => {
          const forcesData = res.data.filter(item => item.type === 'force');
          const risquesData = res.data.filter(item => item.type === 'risque');
          setForces(forcesData);
          setRisques(risquesData);
        });
    }
  }, [symbol, id]);

  const add = (symbol) => {
    axios.post('http://localhost:4000/addforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      });
  };

  const deleteItem = (symbol) => {
    axios.post('http://localhost:4000/deleteforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      });
  };

  const sendForce = (e) => {
    e.preventDefault();
    if (force.trim().length > 0) {
      axios.post('http://localhost:4000/sendforce', { symbol, id, force }).then(() => {
        setForce('');
      });
    }
  };

  const sendRisque = (e) => {
    e.preventDefault();
    if (risque.trim().length > 0) {
      axios.post('http://localhost:4000/sendrisque', { symbol, id, risque }).then(() => {
        setRisque('');
      });
    }
  };

  const supprimer = (index) => {
    axios.post('http://localhost:4000/deleteanalyse', { index });
  };

  const handleModalOpen = (question) => {
    setModalQuestion(question);
    setSelectedResponse(""); // Réinitialise la réponse sélectionnée
    setJustification(""); // Réinitialise la justification
    // Code to open modal here
  };

  const handleModalClose = () => {
    setModalQuestion(null);
    // Code to close modal here
  };

  const handleSubmit = () => {
    // Envoie la réponse et la justification à votre API
    // Utilisez axios.post ici pour envoyer les données à votre backend
    // Assurez-vous de fermer la modal après soumission
    handleModalClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return infos.map((info, index) => (
          <div key={index}>
            <img src={info.image} className="img-fluid" alt="Company" />
            <p><strong>Symbol:</strong> {info.symbol}</p>
            <p><strong>CEO:</strong> {info.ceo}</p>
            <p><strong>Industry:</strong> {info.industry}</p>
            <p><strong>Sector:</strong> {info.sector}</p>
            <p><strong>Website:</strong> <a href={info.website}>{info.website}</a></p>
            <p><strong>Market Cap:</strong> {info.mktCap}</p>
            <p><strong>Price:</strong> {info.price}</p>
            <p><strong>Address:</strong> {info.address}, {info.city}, {info.country}</p>
            <p><strong>Currency:</strong> {info.currency}</p>
          </div>
        ));
      case 'financials':
        return <p>Les données financières seront affichées ici.</p>;
      case 'news':
        return (
          <div>
            <form onSubmit={sendForce}>
              <label>Force :</label>
              <input type="text" className="form-control" value={force} onChange={e => setForce(e.target.value)} />
              <button type="submit" className="btn btn-success mt-2">Soumettre</button>
            </form>
            <ul className="list-group mt-3">
              {forces.map((forceItem, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {forceItem.content}
                  <button className="btn btn-danger btn-sm" onClick={() => supprimer(forceItem.id)}>Supprimer</button>
                </li>
              ))}
            </ul>

            <form onSubmit={sendRisque} className="mt-4">
              <label>Risque :</label>
              <input type="text" className="form-control" value={risque} onChange={e => setRisque(e.target.value)} />
              <button type="submit" className="btn btn-success mt-2">Soumettre</button>
            </form>
            <ul className="list-group mt-3">
              {risques.map((risqueItem, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {risqueItem.content}
                  <button className="btn btn-danger btn-sm" onClick={() => supprimer(risqueItem.id)}>Supprimer</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'evaluation':
        return (
          <div>
            {Object.keys(questionsByCategory).map(category => (
              <div key={category} className="mt-4">
                <h5>{category}</h5>
                <ul className="list-group">
                  {questionsByCategory[category].map((question, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {question}
                      <button className="btn btn-primary btn-sm" onClick={() => handleModalOpen(question)}>Répondre</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h1>{symbol}</h1>
      <div>
        <button className="btn btn-primary" onClick={() => setActiveTab('news')}>Actualités</button>
        <button className="btn btn-primary mx-2" onClick={() => setActiveTab('profile')}>Profile</button>
        <button className="btn btn-primary" onClick={() => setActiveTab('financials')}>Financials</button>
        <button className="btn btn-primary" onClick={() => setActiveTab('evaluation')}>Évaluation</button>
      </div>
      <div className="mt-4">
        {renderTabContent()}
      </div>

      {/* Modal pour répondre à une question */}
      {modalQuestion && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Répondre à la question</h5>
                <button type="button" className="close" onClick={handleModalClose}>&times;</button>
              </div>
              <div className="modal-body">
                <h6>{modalQuestion}</h6>
                <select
                  className="form-control"
                  id="response"
                  value={selectedResponse}
                  onChange={(e) => setSelectedResponse(e.target.value)}
                >
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                  <option value="neutre">Neutre</option>
                </select>
                <textarea
                  className="form-control mt-2"
                  id="justification"
                  rows="3"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Justification"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Fermer</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Soumettre</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
