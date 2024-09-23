import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Screener() {
  const [infos, setInfos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get('http://localhost:4000/screener')
      .then(res => setInfos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Calculer les éléments à afficher pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = infos.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour changer de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(infos.length / itemsPerPage);

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Logo</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((company, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <img src={company.logo} alt={`${company.Name} logo`} style={{ maxWidth: '50px', height: 'auto' }} />
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {company.Name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              cursor: 'pointer',
              backgroundColor: currentPage === index + 1 ? '#007bff' : '#fff',
              color: currentPage === index + 1 ? '#fff' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '5px'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
