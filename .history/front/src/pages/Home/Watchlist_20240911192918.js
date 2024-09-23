import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaCheck, FaTimes} from 'react-icons/fa';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState([{ filterType: '', selectedOption: '', min: '', max: '' }]);
  const [columns, setColumns] = useState(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [secondSelectChanged, setSecondSelectChanged] = useState(false);
  const itemsPerPage = 20;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
  
    const updatedColumns = Array.from(columns);
    const [removed] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, removed);
  
    setColumns(updatedColumns);
    // Enregistrer l'ordre des colonnes dans le localStorage
    localStorage.setItem('draggedColumns', JSON.stringify(updatedColumns));
  };
  
  useEffect(() => {
    const savedColumns = localStorage.getItem('draggedColumns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }else {
      // Colonnes par défaut si aucune sauvegarde
      setColumns(['Name', 'pays', 'secteur', 'industrie', 'Capitalisation']);
    }
  }, []);
  
 
  const handleCloseModal = () => setShowModal(false);
  const getAvailableRatioOptions = (currentFilterIndex) => {
    // Obtenir les ratios déjà sélectionnés dans d'autres filtres
    const selectedRatios = filters
      .map((filter, index) => (index !== currentFilterIndex ? filter.filterType : null))
      .filter(Boolean);

    // Retourner les ratios qui ne sont pas encore sélectionnés
    return Object.keys(ratioNames).filter((ratio) => !selectedRatios.includes(ratio));
  };

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => {
        const sortedData = res.data.sort((a, b) => b.Capitalisation - a.Capitalisation); // Décroissant
        setInfos(sortedData);
        setFilteredInfos(sortedData); // Initialement, les infos filtrées sont les mêmes que les infos triées
      });
  }, []);
  

  useEffect(() => {
    const initialColumns = ['Nom', 'pays', 'secteur', 'industrie', 'Capitalisation', 'exchangeShortName','Pea' , 'Dividende'];
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
    const formattedNumber = (num / 1e9).toFixed(2);
    return `${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`; 
  };
  

  return (
    <section className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Screener Quality</h2>
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher par nom ou symbole"
            value={query}
            onChange={handleQueryChange}
          />
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Filtres
          </Button>
        </div>
      </div>
      <table className="table" style={{ width: '100%', tableLayout: 'auto' }}>
  <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="droppable" direction="horizontal">
      {(provided) => (
        <thead ref={provided.innerRef} {...provided.droppableProps}>
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
                      {col === 'Capitalisation' ? 'Capitalisation (MDS)' :"sdds"}
                    </div>
                  </th>
                )}
              </Draggable>
            ))}
          </tr>
        </thead>
      )}
    </Droppable>
  </DragDropContext>
  <tbody>
    {currentItems.map((info, index) => (
      <tr
        key={index}
        onClick={() => window.open(`/details/${info.symbol}`, '_blank')}
        style={{ cursor: 'pointer' }}
      >
        {columns.map((col, idx) => {
          // Trouver l'index de la colonne "Dividende"
          const divIndex = columns.indexOf('Dividende');
          
          return (
            <td
              key={idx}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                maxWidth: col === 'Nom' ? '300px' : '150px',
                textAlign: col === 'Capitalisation' || col === 'Pea' || col === 'Dividende' ? 'center' : 'left',
                paddingRight: col === 'Capitalisation' ? '50px' : '0', // Décaler à gauche
                paddingLeft: idx > divIndex ? '50px' : '0', // Décaler les cellules après "Dividende"
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
          );
        })}
      </tr>
    ))}
  </tbody>
</table>

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Suivant
        </button>
      </div>
    </section>
  );
}