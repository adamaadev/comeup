import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Screener() {

  return (
    <div className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="mb-0">Screener</h2>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher sur la liste"
            value={query}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Pays</th>
              <th>Industrie</th>
              <th>Capitalisation</th>
              <th>Eligible PEA</th>
              <th>Verse Dividende</th>
            </tr>
          </thead>
          <tbody>
            {filteredInfos.map((company, index) => (
              <tr key={company.symbol} onClick={() => window.open(`/details/${company.symbol}`, '_blank')}>
                <td>{index + 1}</td>
                <td className="d-flex align-items-center">
                  <img
                    src={company.logo}
                    alt={`${company.Name} logo`}
                    width="50"
                    height="50"
                    onError={handleError}
                    style={{ display: 'block', marginRight: '10px' }}
                  />
                  <div>
                    <div>{company.Name}</div>
                    <div>{company.symbol}</div>
                  </div>
                </td>
                <td>{company.pays}</td>
                <td>{company.secteur} / {company.industrie}</td>
                <td>{formatNumber(company.marketCap)}</td>
                <td>{company.eligiblePea ? 'Oui' : 'Non'}</td>
                <td>{company.VerseDividende ? 'Oui' : 'Non'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span>Page {page} sur {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
