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
            <th style={tableHeaderStyle}>Rachat Net</th>
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
            <td style={tableHeaderStyle}>20+</td>
            <td style={tableHeaderStyle}>4%+</td>
            <td style={tableHeaderStyle}>7-9</td>
            <td style={tableHeaderStyle}>-</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Correct</td>
            <td style={tableHeaderStyle}>10-14</td>
            <td style={tableHeaderStyle}>4-13%</td>
            <td style={tableHeaderStyle}>7-10%</td>
            <td style={tableHeaderStyle}>7-10%</td>
            <td style={tableHeaderStyle}>7-10%</td>
            <td style={tableHeaderStyle}>5-9%</td>
            <td style={tableHeaderStyle}>7-10%</td>
            <td style={tableHeaderStyle}>7-10%</td>
            <td style={tableHeaderStyle}>10-12%</td>
            <td style={tableHeaderStyle}>8-14%</td>
            <td style={tableHeaderStyle}>20-40%</td>
            <td style={tableHeaderStyle}>7-14%</td>
            <td style={tableHeaderStyle}>7-15%</td>
            <td style={tableHeaderStyle}>5-10%</td>
            <td style={tableHeaderStyle}>6-10%</td>
            <td style={tableHeaderStyle}>05-1</td>
            <td style={tableHeaderStyle}>35-50</td>
            <td style={tableHeaderStyle}>5-10%</td>
            <td style={tableHeaderStyle}>5-8%</td>
            <td style={tableHeaderStyle}>10-20</td>
            <td style={tableHeaderStyle}>2-4%</td>
            <td style={tableHeaderStyle}>5-6</td>
            <td style={tableHeaderStyle}>=</td>
          </tr>
          <tr>
           <td style={tableHeaderStyle}>Faible</td>
            <td style={tableHeaderStyle}>10-</td>
            <td style={tableHeaderStyle}>4%-</td>
            <td style={tableHeaderStyle}>7%-</td>
            <td style={tableHeaderStyle}>7%-</td>
            <td style={tableHeaderStyle}>7%-</td>
            <td style={tableHeaderStyle}>5%-</td>
            <td style={tableHeaderStyle}>7%-</td>
            <td style={tableHeaderStyle}>7%-</td>
            <td style={tableHeaderStyle}>10%-</td>
            <td style={tableHeaderStyle}>8%-</td>
            <td style={tableHeaderStyle}>40%+</td>
            <td style={tableHeaderStyle}>7%-</td>
            <td style={tableHeaderStyle}>7%-</td>
            <td style={tableHeaderStyle}>5%-</td>
            <td style={tableHeaderStyle}>6%-</td>
            <td style={tableHeaderStyle}>1+</td>
            <td style={tableHeaderStyle}>50%+</td>
            <td style={tableHeaderStyle}>5%+</td>
            <td style={tableHeaderStyle}>5%-</td>
            <td style={tableHeaderStyle}>10-</td>
            <td style={tableHeaderStyle}>2%-</td>
            <td style={tableHeaderStyle}>4-</td>
            <td style={tableHeaderStyle}>+</td>
          </tr>
          <tr>
            <td style={tableHeaderStyle}>Mediane</td>
            <td style={tableHeaderStyle}>%</td>
            <td style={tableHeaderStyle}>4%</td>
            <td style={tableHeaderStyle}>7%</td>
            <td style={tableHeaderStyle}>7%</td>
            <td style={tableHeaderStyle}>7%</td>
            <td style={tableHeaderStyle}>9%</td>
            <td style={tableHeaderStyle}>7%</td>
            <td style={tableHeaderStyle}>8%</td>
            <td style={tableHeaderStyle}>-0.89%</td>
            <td style={tableHeaderStyle}>8%</td>
            <td style={tableHeaderStyle}>20%</td>
            <td style={tableHeaderStyle}>7%</td>
            <td style={tableHeaderStyle}>7%</td>
            <td style={tableHeaderStyle}>7%</td>
            <td style={tableHeaderStyle}>6%</td>
            <td style={tableHeaderStyle}>1</td>
            <td style={tableHeaderStyle}>40%</td>
            <td style={tableHeaderStyle}>5%</td>
            <td style={tableHeaderStyle}>6%</td>
            <td style={tableHeaderStyle}>11</td>
            <td style={tableHeaderStyle}>2%</td>
            <td style={tableHeaderStyle}>6</td>
            <td style={tableHeaderStyle}></td>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>

      <div className="container">
  <div className="row">
    <div className="col-md-4">
      <h2>Quali Score</h2>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
            <th>Score total / 20</th>
            <th>Couleur</th>
            <th>Classement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{'>='}15 points</td>
            <td>Verte</td>
            <td>Excellente</td>
          </tr>
          <tr>
            <td>Entre 10 et 15 points</td>
            <td>Orange</td>
            <td>Correcte</td>
          </tr>
          <tr>
            <td>{'<'}10 points</td>
            <td>Rouge</td>
            <td>Faible</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div className="col-md-4">
      <h2>Quanti Score</h2>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
            <th>Score total / 20</th>
            <th>Couleur</th>
            <th>Classement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{'>='}15 points</td>
            <td>Verte</td>
            <td>Excellente</td>
          </tr>
          <tr>
            <td>Entre 10 et 15 points</td>
            <td>Orange</td>
            <td>Correcte</td>
          </tr>
          <tr>
            <td>{'<'}10 points</td>
            <td>Rouge</td>
            <td>Faible</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div className="col-md-4">
      <h2>Checklist qualitative</h2>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
            <th>Réponses</th>
            <th>Points attribués</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Oui</td>
            <td>+1 point</td>
          </tr>
          <tr>
            <td>Non</td>
            <td>+0 point</td>
          </tr>
          <tr>
            <td>Partiellement</td>
            <td>+0.5 point</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid black', 
  margin: '5px',
  textAlign: 'center',

};
