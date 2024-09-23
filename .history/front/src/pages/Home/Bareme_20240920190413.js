import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Bareme() {
  const [scores, setScores] = useState({
    count_above_15: 0,
    count_between_10_and_15: 0,
    count_below_10: 0,
  });

  useEffect(() => {
    // Fonction pour récupérer les scores depuis l'API
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getscore');
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);
  return (
    <div style={{ margin: '20px' }}>
       <h1>Scores des Entreprises</h1>
      <p>Nombre d'entreprises avec un score excellent: {scores.count_above_15}</p>
      <p>Nombre d'entreprises avec un score correct: {scores.count_between_10_and_15}</p>
      <p>Nombre d'entreprises avec un score faible: {scores.count_below_10}</p>
      <table className="table table-bordered">
        <thead className='Bareme'>
          <tr>
          <th colSpan="3" className="no-border"></th>
            <th colSpan="3">Croissance</th>
            <th colSpan="3">FCF</th>
            <th colSpan="2">Résultat Net</th>
            <th colSpan="1">Capex / Résultat Net</th>
            <th colSpan="2">Roce</th>
            <th colSpan="2">FCF Margin</th>
            <th colSpan="1">Debt / Equity</th>
            <th colSpan="1">Payout Ratio</th>
            <th colSpan="3">Dividende</th>
            <th colSpan="3">Autres</th>
          </tr>
          <tr>
            <th>Criteres</th>
            <th>Quanti Score / 20</th>
            <th>Performance 5 A</th>
            <th>CA 1 A</th>
            <th>CA 5 A</th>
            <th>CA 10 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>10 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>5 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>1 A</th>
            <th>1 A</th>
            <th>1 A</th>
            <th>5 A</th>
            <th>10 A</th>
            <th>Buyback Yield</th>
            <th>Piotroski Score</th>
            <th>Rachat Net</th>
          </tr>
          <tr>
            <td>Excellent</td>
            <td>15+</td>
            <td>13%+</td>
            <td>10%+</td>
            <td>10%+</td>
            <td>10%+</td>
            <td>9%+</td>
            <td>10%+</td>
            <td>10%+</td>
            <td>12%+</td>
            <td>14%+</td>
            <td>20%-</td>
            <td>14%+</td>
            <td>15%+</td>
            <td>10%+</td>
            <td>10%</td>
            <td>0.5</td>
            <td>35-</td>
            <td>10%+</td>
            <td>8%+</td>
            <td>20+</td>
            <td>4%+</td>
            <td>7-9</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Correct</td>
            <td>10-14</td>
            <td>4-13%</td>
            <td>7-10%</td>
            <td>7-10%</td>
            <td>7-10%</td>
            <td>5-9%</td>
            <td>7-10%</td>
            <td>7-10%</td>
            <td>10-12%</td>
            <td>8-14%</td>
            <td>20-40%</td>
            <td>7-14%</td>
            <td>7-15%</td>
            <td>5-10%</td>
            <td>6-10%</td>
            <td>05-1</td>
            <td>35-50</td>
            <td>5-10%</td>
            <td>5-8%</td>
            <td>10-20</td>
            <td>2-4%</td>
            <td>5-6</td>
            <td>=</td>
          </tr>
          <tr>
           <td>Faible</td>
            <td>10-</td>
            <td>4%-</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>5%-</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>10%-</td>
            <td>8%-</td>
            <td>40%+</td>
            <td>7%-</td>
            <td>7%-</td>
            <td>5%-</td>
            <td>6%-</td>
            <td>1+</td>
            <td>50%+</td>
            <td>5%+</td>
            <td>5%-</td>
            <td>10-</td>
            <td>2%-</td>
            <td>4-</td>
            <td>+</td>
          </tr>
          <tr>
            <td>Mediane</td>
            <td>%</td>
            <td>4%</td>
            <td>7%</td>
            <td>7%</td>
            <td>7%</td>
            <td>9%</td>
            <td>7%</td>
            <td>8%</td>
            <td>-0.89%</td>
            <td>8%</td>
            <td>20%</td>
            <td>7%</td>
            <td>7%</td>
            <td>7%</td>
            <td>6%</td>
            <td>1</td>
            <td>40%</td>
            <td>5%</td>
            <td>6%</td>
            <td>11</td>
            <td>2%</td>
            <td>6</td>
            <td></td>
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
