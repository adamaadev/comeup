import React from 'react';

export default function Bareme() {
  return (
    <div style={{ margin: '20px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th colSpan="3"></th>
            <th style={tableHeaderStyle} colSpan="3">Croissance</th>
          </tr>
          <tr>
            <th style={tableHeaderStyle}>Criteres</th>
            <th style={tableHeaderStyle}>dsd</th>
            <th style={tableHeaderStyle}>dssd</th>
            <th style={tableHeaderStyle}>CA 1 an</th>
            <th style={tableHeaderStyle}>CA 5 ans</th>
            <th style={tableHeaderStyle}>CA 10 ans</th>
          </tr>
        </thead>
        <tbody>
          {/* Ajouter des lignes de données ici */}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid black',
  padding: '10px',
  margin: '5px',
  textAlign: 'left',
};
