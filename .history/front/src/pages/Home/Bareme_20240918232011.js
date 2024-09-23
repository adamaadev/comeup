import React from 'react';

export default function Bareme() {
  return (
    <div style={{ margin: '20px' }}>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th colSpan="3" style={{ border: '1px solid black', padding: '10px' }}>Croissance</th>
          </tr>
          <tr>
            <th style={{ border: '1px solid black', padding: '10px' }}></th>
            <th style={{ border: '1px solid black', padding: '10px' }}></th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Criteres</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Quanti Score / 20</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Performance 5 ans</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>CA 1 an</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>CA 5 ans</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>CA 10 ans</th>
          </tr>
        </thead>
        <tbody>
          {/* Vous pouvez ajouter des lignes de données ici */}
        </tbody>
      </table>
    </div>
  );
}
