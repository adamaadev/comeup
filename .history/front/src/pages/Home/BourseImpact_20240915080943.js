import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function BourseImpact() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState([]);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;
  const type = "admin";

  const ratioNames = {
    'exchangeShortName': 'exchange',
    'pays': 'Pays',
    'secteur': 'Secteur',
    'industrie': 'Industrie',
  };

  useEffect(() => {
    // Charger les colonnes depuis le localStorage ou définir des colonnes par défaut
    const savedColumns = JSON.parse(localStorage.getItem('columns'));
    if (savedColumns) {
      setColumns(savedColumns);
    } else {
      // Colonnes par défaut si aucune valeur n'est trouvée dans le localStorage
      setColumns(['Nom', 'pays', 'secteur', 'industrie', 'Capitalisation']);
    }

    axios.post('http://localhost:4000/watchlist', { type })
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.marketCap - a.marketCap); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);

  useEffect(() => {
    const initialColumns = ['Nom', 'pays', 'secteur', 'industrie', 'Capitalisation', 'exchangeShortName', 'Pea', 'Dividende'];
    const newColumns = [
      ...initialColumns.filter(col => col !== 'exchangeShortName'),
      ...filters
        .map(f => f.filterType)
        .filter(f => f && !initialColumns.includes(f))
    ];
    setColumns(newColumns);
  }, [filters]);

  const handleQueryChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery === '') {
      // Réinitialiser les résultats filtrés pour afficher toutes les entreprises
      setFilteredInfos(infos);
    } else {
      setSecondSelectChanged(true); // Forcer la réapplication des filtres avec la nouvelle recherche
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInfos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredInfos.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const formatNumber = (num) => {
    // Convertir le nombre en milliards, et arrondir à 2 décimales
    const formattedNumber = (num / 1e9).toFixed(2);

    // Séparer le nombre en groupe avec l'espace insécable (U+202F) après le premier groupe de chiffres
    return `${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
  
    if (!destination) return;
  
    const newColumns = Array.from(columns);
    const [movedColumn] = newColumns.splice(source.index, 1);
    newColumns.splice(destination.index, 0, movedColumn);
  
    setColumns(newColumns);
  
    // Sauvegarder les nouvelles colonnes dans le localStorage
    localStorage.setItem('columns', JSON.stringify(newColumns));
    console.log('Colonnes mises à jour dans localStorage:', newColumns);
  };
  
  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">WatchList Bourse Impact</h2>
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher par nom ou symbole"
            value={query}
            onChange={handleQueryChange}
          />
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <table
              className="table"
              style={{ width: '100%', tableLayout: 'auto' }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <Draggable key={col} draggableId={col} index={idx}>
                      {(provided) => (
                        <th
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span style={{ marginRight: '5px', fontWeight: 'bold', visibility: 'hidden' }}>P</span>
                            {col === 'Capitalisation' ? 'Capitalisation (MDS)' : ratioNames[col] || col}
                          </div>
                        </th>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((info, index) => (
                  <tr
                    key={index}
                    onClick={() => window.open(`/details/${info.symbol}`, '_blank')}
                    style={{ cursor: 'pointer' }}
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        style={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          maxWidth: col === 'Nom' ? '300px' : '150px',
                          textAlign: col === 'Capitalisation' || col === 'Pea' || col === 'Dividende' ? 'center' : 'left',
                          paddingRight: col === 'Capitalisation' ? '50px' : '0', // Décaler à gauche
                        }}
                      >
                        {col === 'Nom' ? (
                          <div className="d-flex align-items-center">
                            {info.logo ? (
                              <img
                                src={info.logo}
                                alt={`${info.Name} logo`}
                                width="50"
                                height="50"
                                style={{ display: 'block', marginRight: '10px' }}
                              />
                            ) : null}
                            <div>
                              {info.Nom}
                              {info.symbol && info.exchangeShortName && (
                                <div style={{ fontSize: '0.9em' }}>
                                  <span>{info.symbol} </span>
                                  <span style={{ fontWeight: 'bold' }}> : {info.exchangeShortName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : info[col] !== undefined ? (
                          col === 'Capitalisation' && info.Capitalisation ? (
                            formatNumber(info.Capitalisation)
                          ) : col === 'Pea' || col === 'Dividende' ? (
                            info[col] === 1 ? <FaCheck color="green" /> : <FaTimes color="red" />
                          ) : (
                            info[col]
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
      {filteredInfos.length > 20 ? (
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
            Précédent
          </button>
          <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Suivant
          </button>
        </div>
      ) : ""}
    </section>
  );
}
