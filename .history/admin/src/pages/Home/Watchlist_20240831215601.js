import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa'; // Importer l'icône

export default function Watchlist() {
  const type = "admin";
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id));
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/watchlist', { id, type })
        .then(res => {
          const data = res.data;
          // Charger l'ordre à partir du localStorage, s'il existe
          const savedOrder = localStorage.getItem('watchlistOrder');
          if (savedOrder) {
            const order = JSON.parse(savedOrder);
            const orderedInfos = order.map(symbol => data.find(item => item.symbol === symbol));
            setInfos(orderedInfos);
          } else {
            setInfos(data);
          }
        });
    }
  }, [id]);

  const handleQueryChange = (event) => setQuery(event.target.value);

  const filteredInfos = infos.filter(info =>
    info.Name.toLowerCase().includes(query.toLowerCase()) ||
    info.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const formatNumber = (num) => {
    return (num / 1e9).toFixed(3);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(infos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setInfos(items);

    // Sauvegarder l'ordre dans le localStorage
    const newOrder = items.map(item => item.symbol);
    localStorage.setItem('watchlistOrder', JSON.stringify(newOrder));

    // Optionnel : sauvegarder l'ordre sur le serveur
    saveOrder(items);
  };

  const saveOrder = (newOrder) => {
    axios.post('http://localhost:4000/save-order', { id, order: newOrder })
      .then(res => console.log('Order saved'))
      .catch(err => console.error('Error saving order:', err));
  };

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
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="watchlist">
              {(provided) => (
                <table 
                  className="table table-striped" 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                >
                  <thead>
                    <tr>
                      <th></th> {/* Colonne pour l'icône */}
                      <th>Nom</th>
                      <th>Pays</th>
                      <th>Secteur</th>
                      <th>Industrie</th>
                      <th style={{ whiteSpace: 'nowrap' }}>Capitalisation (MDS)</th>
                      <th>PEA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInfos.map((company, index) => (
                      <Draggable 
                        key={company.symbol} 
                        draggableId={company.symbol} 
                        index={index}
                      >
                        {(provided) => (
                          <tr 
                            ref={provided.innerRef} 
                            {...provided.draggableProps} 
                            {...provided.dragHandleProps}
                            onClick={() => window.open(`/details/${company.symbol}`, '_blank')}
                          >
                            <td className="drag-icon" {...provided.dragHandleProps}>
                              <FaGripVertical />
                            </td>
                            <td className="d-flex align-items-center">
                              <img 
                                src={company.logo} 
                                width="50" 
                                height="50" 
                                style={{ display: 'block', marginRight: '10px' }} 
                                alt={`${company.Name} logo`} 
                              />
                              <div>
                                <div>{company.Name}</div>
                                <div>{company.symbol} : <strong>{company.exchangeShortName}</strong></div>
                              </div>
                            </td>
                            <td>{company.pays}</td>
                            <td>{company.secteur}</td>
                            <td>{company.industrie}</td>
                            <td>{formatNumber(company.marketcap)}</td>
                            <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="alert alert-warning" role="alert">
            Aucune entreprise disponible
          </div>
        )}
      </div>
    </section>
  );
}
