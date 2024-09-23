import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical } from 'react-icons/fa';

export default function Watchlist() {
  const type = "admin";
  const [id, setId] = useState();
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const initialColumns = [
    { id: 'nom', label: 'Nom' },
    { id: 'pays', label: 'Pays' },
    { id: 'secteur', label: 'Secteur' },
    { id: 'industrie', label: 'Industrie' },
    { id: 'capitalisation', label: 'Capitalisation (MDS)' },
    { id: 'pea', label: 'PEA' }
  ];

  const savedColumns = JSON.parse(localStorage.getItem('columns'));
  const [columns, setColumns] = useState(savedColumns || initialColumns);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.post('http://localhost:4000/', { type })
      .then(res => setId(res.data.id));
  }, []);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/watchlist', { id, type })
        .then(res => {
          setInfos(res.data);
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

    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);

    setColumns(reorderedColumns);
    localStorage.setItem('columns', JSON.stringify(reorderedColumns));
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
            <table className="table table-striped">
              <Droppable droppableId="columns" direction="horizontal" type="column">
                {(provided) => (
                  <thead ref={provided.innerRef} {...provided.droppableProps}>
                    <tr>
                      <th></th> {/* Colonne pour l'icône */}
                      {columns.map((col, index) => (
                        <Draggable key={col.id} draggableId={col.id} index={index}>
                          {(provided) => (
                            <th
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <FaGripVertical /> {col.label}
                            </th>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tr>
                  </thead>
                )}
              </Droppable>
              <tbody>
                {filteredInfos.map((company) => (
                  <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                    <td></td> {/* Colonne pour l'icône (FaGripVertical) retirée */}
                    {columns.map((col) => (
                      <td key={col.id}>
                        {col.id === 'nom' && (
                          <div className="d-flex align-items-center">
                            <img src={company.logo} width="50" height="50" style={{ display: 'block', marginRight: '10px' }} alt={`${company.Name} logo`} />
                            <div>
                              <div>{company.Name}</div>
                              <div>{company.symbol} : <strong>{company.exchangeShortName}</strong></div>
                            </div>
                          </div>
                        )}
                        {col.id === 'pays' && company.pays}
                        {col.id === 'secteur' && company.secteur}
                        {col.id === 'industrie' && company.industrie}
                        {col.id === 'capitalisation' && formatNumber(company.marketcap)}
                        {col.id === 'pea' && (company.eligiblePea ? 'Oui' : 'Non')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
