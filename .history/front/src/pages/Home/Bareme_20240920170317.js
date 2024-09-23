import React from 'react';

export default function Bareme() {
  return (
    <div style={{ margin: '20px' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead className='Bareme'>
          <tr>
            <th colSpan="3"></th>
            <th style={tableHeaderStyle} colSpan="3">Croissance</th>
            <th style={tableHeaderStyle} colSpan="3">FCF</th>
            <th style={tableHeaderStyle} colSpan="2">Résultat Net</th>
            <th style={tableHeaderStyle} colSpan="1">Capex / Résultat Net</th>
            <th style={tableHeaderStyle} colSpan="2">Roce</th>
            <th style={tableHeaderStyle} colSpan="2">FCF Margin</th>
            <th style={tableHeaderStyle} colSpan="1">Debt / Equity</th>
            <th style={tableHeaderStyle} colSpan="1">Payout Ratio</th>
            <th style={tableHeaderStyle} colSpan="3">Dividende</th>
            <th style={tableHeaderStyle} colSpan="2">Autres</th>
          </tr>
          <tr>
            <th style={tableHeaderStyle}>Criteres</th>
            <th style={tableHeaderStyle}>Quanti Score / 20</th>
            <th style={tableHeaderStyle}>Performance 5 A</th>
            <th style={tableHeaderStyle}>CA 1 A</th>
            <th style={tableHeaderStyle}>CA 5 A</th>
            <th style={tableHeaderStyle}>CA 10 A</th>
            <th style={tableHeaderStyle}>1 A</th>
            <th style={tableHeaderStyle}>5 A</th>
            <th style={tableHeaderStyle}>10 A</th>
            <th style={tableHeaderStyle}>1 A</th>
            <th style={tableHeaderStyle}>5 A</th>
            <th style={tableHeaderStyle}>5 A</th>
            <th style={tableHeaderStyle}>1 A</th>
            <th style={tableHeaderStyle}>5 A</th>
            <th style={tableHeaderStyle}>1 A</th>
            <th style={tableHeaderStyle}>5 A</th>
            <th style={tableHeaderStyle}>1 A</th>
            <th style={tableHeaderStyle}>1 A</th>
            <th style={tableHeaderStyle}>1 A</th>
            <th style={tableHeaderStyle}>5 A</th>
            <th style={tableHeaderStyle}>10 A</th>
            <th style={tableHeaderStyle}>Buyback Yield</th>
            <th style={tableHeaderStyle}>Piotroski Score</th>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Excellent</td>
            <td style={tableHeaderStyle}>15+</td>
            <td style={tableHeaderStyle}>13%+</td>
            <td style={tableHeaderStyle}>10%+</td>
            <td style={tableHeaderStyle}>10%+</td>
            <td style={tableHeaderStyle}>10%+</td>
            <td style={tableHeaderStyle}>9%+</td>
            <td style={tableHeaderStyle}>10%+</td>
            <td style={tableHeaderStyle}>10%+</td>
            <td style={tableHeaderStyle}>12%+</td>
            <td style={tableHeaderStyle}>14%+</td>
            <td style={tableHeaderStyle}>20%-</td>
            <td style={tableHeaderStyle}>14%+</td>
            <td style={tableHeaderStyle}>15%+</td>
            <td style={tableHeaderStyle}>10%+</td>
            <td style={tableHeaderStyle}>10%</td>
            <td style={tableHeaderStyle}>0.5</td>
            <td style={tableHeaderStyle}>35-</td>
            <td style={tableHeaderStyle}>10%+</td>
            <td style={tableHeaderStyle}>8%+</td>
            <td style={tableHeaderStyle}>20%+</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Correct</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Faible</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Mediane</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>%</td>
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
