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
            <th style={tableHeaderStyle}>Quanti Score / 20</th>
            <th style={tableHeaderStyle}>Performance 5 ans</th>
            <th style={tableHeaderStyle}>CA 1 an</th>
            <th style={tableHeaderStyle}>CA 5 ans</th>
            <th style={tableHeaderStyle}>CA 10 ans</th>
            <th style={tableHeaderStyle}>CA 1 an</th>
            <th style={tableHeaderStyle}>CA 5 ans</th>
            <th style={tableHeaderStyle}>CA 10 ans</th>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Excellent</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Correct</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Faible</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Mediane</td>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid black',
  
  margin: '5px',
  textAlign: 'center',
};
