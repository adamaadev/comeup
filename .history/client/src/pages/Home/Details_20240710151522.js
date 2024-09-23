import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import questionsByCategory from './Questions';
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
  const [selectedResponse, setSelectedResponse] = useState(""); // State for selected response
  const [justification, setJustification] = useState(""); // State for justification


  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.success) {
          setId(res.data.id);
        }
      });
  }, []);

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
      "Les clients expriment-ils généralement une satisfaction élevé à l’égard des produits ou service de l’entreprise ?",
      "L’entreprise propose t-elle des produits ou services uniques, se démarquant clairement de la concurrence ?",
      "L’entreprise est elle leader dans son marché / industrie ?",
      "L’entreprise fait-elle preuve de résilience face à la concurrence, en maintenant ou en renforçant sa position sur le marché malgré les pressions concurrentielles ?",
      "L’entreprise peut-elle augmenter ses prix facilement, sans répercussion majeure ?",
      "L’entreprise opère t-elle à l’échelle internationale ?"
    ],
    management: [
      "Est-ce que l’entreprise alloue efficacement son capital ? (Disponible sur le rapport de Morningstar).",
      "L’entreprise est-elle facile à gérer",
      "L’entreprise met elle l’accent sur la qualité de ses produits ?",
      "Le management de l’entreprise est-il compétent ?",
      "Le management a t-il un intérêt financier dans l’entreprise ? (Possède t’il des parts, s’agit t’il d’une entreprise familiale, le CEO possède des primes ou des bonus liés au résultats de l’entreprise ?)",
      "Est-ce que l’entreprise privilégie les intérêts de ses actionnaires ? (Généreux programmes de retour aux actions, que ce soit les dividendes ou les rachats d’actions)"
    ],
    autres: [
      "Est ce que l’entreprise présente des perspectives de croissances significatives ?",
      "Est-ce l’entreprise opère dans un secteur en expansion ?"
    ]}

  useEffect(() => {
    const allQuestions = Object.values(questionsByCategory).flat();

    allQuestions.forEach((question, index) => {
        axios.post('http://localhost:4000/checkquestion',{question})
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
        axios.post('http://localhost:4000/checkcompany',{ companyName , image , symbol , country , mktCap , sector })
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
    // Code to open modal here
  };

  const handleModalClose = () => {
    setModalQuestion(null);
    // Code to close modal here
  };

  const handleResponseChange = (e) => {
    setSelectedResponse(e.target.value);
  };

  const handleJustificationChange = (e) => {
    setJustification(e.target.value);
  };

  const handleSubmit = () => {
    // Log the modalQuestion and the form data
    if (selectedResponse !== "") {
      axios.post('http://localhost:4000/sendquestion',{id , symbol , modalQuestion , selectedResponse , justification})
      setJustification('')
    }else{
      alert("remplissez tout le formulaire");
    }
    // Ajoutez ici le code pour soumettre les données si nécessaire
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

            {/* Affichage des questions par catégorie */}
            <div className="mt-4">
              <h4>Les produits</h4>
              <ul>
                {questionsByCategory.produits.map((question, index) => (
                  <li key={index}>
                    {question}
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  </li>
                ))}
              </ul>

              <h4 className="mt-4">Le positionnement</h4>
              <ul>
                {questionsByCategory.positionnement.map((question, index) => (
                  <li key={index}>
                    {question}
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  </li>
                ))}
              </ul>

              <h4 className="mt-4">Le management</h4>
              <ul>
                {questionsByCategory.management.map((question, index) => (
                  <li key={index}>
                    {question}
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  </li>
                ))}
              </ul>

              <h4 className="mt-4">Autres questions</h4>
              <ul>
                {questionsByCategory.autres.map((question, index) => (
                  <li key={index}>
                    {question}
                    <button className="btn btn-primary ml-2" onClick={() => handleModalOpen(question)}>Répondre</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modale pour répondre aux questions */}
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
                 <form>
                   <div className="modal-body">
                     <p>{modalQuestion}</p>
                     <div className="form-group">
                       <label htmlFor="response">Réponse :</label>
                       <select
                         className="form-control"
                         id="response"
                         value={selectedResponse}
                         onChange={handleResponseChange}
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
                       ></textarea>
                     </div>
                   </div>
                   <div className="modal-footer">
                     <button type="button" className="btn btn-primary" onClick={handleSubmit}>
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
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="card mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Nom : {infos[0]?.companyName}</h2>
          {exist ? (
            <button className="btn btn-danger btn-sm" onClick={() => deleteItem(symbol)}>Retirer de la watchlist</button>
          ) : (
            <button className="btn btn-success btn-sm" onClick={() => add(symbol)}>Ajouter à la watchlist</button>
          )}
        </div>
        <div className="card-body">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Informations</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>Analyse</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>Statistiques</button>
            </li>
          </ul>
          <div className="mt-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
