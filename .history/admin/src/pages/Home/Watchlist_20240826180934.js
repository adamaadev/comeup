import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Watchlist() {
  const type = "admin";
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [icon, setIcon] = useState(faComment);
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState('');

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id));
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/watchlist', { id, type })
        .then(res => setInfos(res.data));
    }
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:4000/users')
      .then(res => setEmails(res.data))
      .catch(err => console.error('Erreur lors de la récupération des emails', err));
  }, []);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const filteredInfos = infos.filter(info =>
    info.Name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setIcon(isFormVisible ? faComment : faTimes);
  };

  const handleEmailSend = (event) => {
    event.preventDefault();
    axios.post('http://localhost:4000/sendemail', {
      to: emails,
      message: message
    })
    .then(res => {
      alert(res.data.message);
      setMessage(''); // Clear the message field
      toggleForm(); // Optionally hide the form after sending
    })
    .catch(err => console.error('Erreur lors de l\'envoi de l\'email', err));
  };

  // Calculer la hauteur du formulaire en fonction de la taille du message
  const formHeight = Math.max(200, 100 + message.split('\n').length * 30); // Ajuster en fonction de la longueur du message

  // Calculer la largeur du champ des e-mails en fonction du nombre d'e-mails
  const emailsWidth = Math.max(200, 10 + emails.length * 10); // Ajuster en fonction du nombre d'e-mails

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Ma watchlist</h2>
        </div>
        <div className="col-md-6">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Rechercher sur la liste" 
            value={query}
            onChange={handleQueryChange}
          />
        </div>
      </div>
      <div className="table-responsive">
        {filteredInfos.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Pays</th>
                <th>Secteur - Industrie</th>
                <th>Capitalisation</th>
                <th>Eligible PEA</th>
                <th>Verse Dividende</th>
              </tr>
            </thead>
            <tbody>
              {filteredInfos.map(company => (
                <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                  <td className="d-flex align-items-center">
                    <img src={company.logo} width="50" height="50" style={{ display: 'block', marginRight: '10px' }}/>
                    <div>
                      <div>{company.Name}</div>
                      <div>{company.symbol}</div>
                    </div>
                  </td>
                  <td>{company.pays}</td>
                  <td>{company.secteur} - {company.industrie}</td>
                  <td>{company.marketcap}</td>
                  <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                  <td>{company.VerseDividende ? 'Oui' : 'Non'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-warning" role="alert">
            Aucune entreprise disponible
          </div>
        )}
      </div>

      <a onClick={toggleForm} style={{ position: 'fixed', bottom: '20px', right: '20px', fontSize: '30px', color: 'black', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={icon} />
      </a>

      {isFormVisible && (
        <div style={{ 
          position: 'fixed', 
          bottom: '70px', 
          right: '20px', 
          backgroundColor: '#f1f1f1', 
          padding: '20px', 
          borderRadius: '5px', 
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
          height: `${formHeight}px`,
          width: '300px' // Assurez-vous que la largeur est suffisante pour contenir le champ des e-mails
        }}>
          <form onSubmit={handleEmailSend}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="emails">Destinataires:</label>
              <input 
                type="text" 
                className="form-control" 
                id="emails" 
                value={emails.join(', ')} 
                readOnly
                style={{ width: `${emailsWidth}px`, marginBottom: '10px' }} // Ajuster la largeur du champ en fonction du nombre d'e-mails
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="message">Message:</label>
              <textarea 
                className="form-control" 
                id="message" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Entrez votre message"
                required
                style={{ height: '100px' }} // Ajuster la hauteur du textarea
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Envoyer</button>
          </form>
        </div>
      )}
    </section>
  );
}
